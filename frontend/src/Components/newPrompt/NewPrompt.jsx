import { useEffect, useRef, useState } from "react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const endRef = useRef(null);
  const formRef = useRef(null);
  const processedChats = useRef(new Set());

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ questionText, answerText }) => {
      questionText, answerText;

      return fetch(`${import.meta.env.VITE_API_URL}/api/chat/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionText?.length ? questionText : undefined,
          answer: answerText,
        }),
      }).then((res) => res.json());
    },
    onSuccess: async (responseData) => {
      // Wait for the refetch to complete
      await queryClient.refetchQueries({ queryKey: ["chat", data._id] });

      // Only then clear the temporary state
      setQuestion("");
      setAnswer("");
    },
    onError: (err) => {
      console.log("Save error:", err);
    },
  });

  const add = async (text, isInitial) => {
    const prompt = `
Your job is to answer queries in Nepali.
Reply only in Nepali. Ensure the text is coherent, natural, and relevant to disasters in Nepal.
Each answer should be at most 10 sentences.
If irrelevant, respond: "मसँग विपद्सँग सम्बन्धित सीमित जानकारी मात्र छ। अन्य प्रश्नहरूको लागि इन्टरनेट हेर्नुहोस्।"
If the question is not in Nepali, respond: "कृपया नेपाली भाषामा प्रश्न सोध्नुहोस्।"
User Question: ${text}
`;

    if (!isInitial) setQuestion(text);

    try {
      const chat = model.startChat({
        history:
          data?.history?.map(({ role, parts }) => ({
            role,
            parts: [{ text: parts?.[0]?.text || "" }],
          })) || [],
        generationConfig: {
          // maxOutputTokens: 100,
        },
      });

      const result = await chat.sendMessageStream([prompt]);
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }

      // Pass the actual values directly to mutation
      mutation.mutate({
        questionText: isInitial ? undefined : text,
        answerText: accumulatedText,
      });
    } catch (err) {
      console.log("Error in add():", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    // Clear input immediately
    formRef.current.reset();

    add(text, false);
  };

  // Handle initial message - only run once per chat ID
  useEffect(() => {
    const chatId = data?._id;

    if (
      chatId &&
      data?.history?.length === 1 &&
      !processedChats.current.has(chatId)
    ) {
      processedChats.current.add(chatId);
      add(data.history[0].parts[0].text, true);
    }
  }, [data?._id, data?.history?.length]);

  return (
    <>
      {question && (
        <div className="bg-[#3a3a3a] rounded-2xl max-w-[80%] p-4 mt-2 self-end">
          {question}
        </div>
      )}
      {answer && (
        <div className="bg-[#3a3a3a] rounded-2xl max-w-[80%] p-4 mt-2 self-start">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="pb-[100px]" ref={endRef}>
        <form
          ref={formRef}
          className="w-1/2 absolute bottom-3 bg-[#2c2937] rounded-2xl flex items-center px-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="text"
            className="flex-1 p-4 border-none outline-none bg-transparent text-[#ececec] text-xl"
            placeholder="प्रश्न सोध्नुहोस...."
          />
          <button
            type="submit"
            className="rounded-full bg-[#605e68] border-none p-2 flex items-center justify-center cursor-pointer"
          >
            <img src="/arrow.png" alt="send" className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
};

export default NewPrompt;
