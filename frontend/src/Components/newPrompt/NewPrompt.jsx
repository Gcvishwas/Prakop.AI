import { useEffect, useRef, useState } from "react";
import { ai, MODEL_NAME, safetySettings } from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ question, answer }) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
        });
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);
    setIsGenerating(true);

    try {
      // Build conversation history for context
      const history = data.history.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.parts[0].text }],
      }));

      // Add current question to history
      if (!isInitial) {
        history.push({
          role: "user",
          parts: [{ text }],
        });
      }

      // Create system prompt
      const systemPrompt = `Your job is to correct the output given by a trained gpt-2 model in Nepali. Reply only in Nepali. Ensure the text is coherent, natural, and relevant to disasters in Nepal. If irrelevant, respond: "मसँग विपद्सँग सम्बन्धित सीमित जानकारी मात्र छ। अन्य प्रश्नहरूको लागि इन्टरनेट हेर्नुहोस्।" If the question is not in Nepali, respond: "कृपया नेपाली भाषामा प्रश्न सोध्नुहोस्।"`;

      // Prepare messages with full context
      const messages = [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        ...history,
      ];

      const response = await ai.models.generateContentStream({
        model: MODEL_NAME,
        contents: messages,
        config: {
          safetySettings: safetySettings,
        },
      });

      let fullAnswer = "";
      for await (const chunk of response) {
        const chunkText = chunk.text;
        fullAnswer += chunkText;
        setAnswer((prev) => prev + chunkText);
      }

      // Only save to DB after streaming is complete
      mutation.mutate({ question: text, answer: fullAnswer });
    } catch (error) {
      console.error("Error generating response:", error);
      setAnswer("त्रुटि भयो। कृपया पुन: प्रयास गर्नुहोस्।");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text || isGenerating) return;
    add(text, false);
  };

  useEffect(() => {
    if (data?.history?.length === 1) {
      add(data.history[0].parts[0].text, true);
    }
  }, [data]);

  return (
    <>
      {question && (
        <div className="bg-[#2c2937] rounded-2xl max-w-[80%] self-end mt-2 p-5">
          {question}
        </div>
      )}
      {answer && (
        <div className="bg-[#2c2937] rounded-2xl max-w-[80%] self-start mt-2 p-5">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="pb-[100px]" ref={endRef}></div>
      {/* Form */}
      <form
        ref={formRef}
        className="w-1/2 absolute bottom-3 bg-[#2c2937] rounded-2xl flex items-center px-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="text"
          disabled={isGenerating}
          className=" flex-1 p-4 border-none outline-none bg-transparent text-[#ececec] text-xl disabled:opacity-50"
          placeholder="प्रश्न सोध्नुहोस...."
        />
        <button
          type="submit"
          disabled={isGenerating}
          className="rounded-full bg-[#605e68] border-none p-2 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src="/arrow.png" alt="send" className="w-4 h-4" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
