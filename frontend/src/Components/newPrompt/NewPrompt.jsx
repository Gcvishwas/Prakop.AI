import { useEffect, useRef, useState } from "react";
import { ai, MODEL_NAME, safetySettings } from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const endRef = useRef(null);
  const formRef = useRef(null);
  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer]);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chat/${data._id}`, {
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
      // Invalidate and refetch
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
    const prompt = `Your job is to answer queries in Nepali.Reply only in Nepali.Ensure the text is coherent, natural, and relevant to disasters in Nepal.Each answer should be of 15 sentences at max.If irrelevant, respond:"मसँग विपद्सँग सम्बन्धित सीमित जानकारी मात्र छ। अन्य प्रश्नहरूको लागि इन्टरनेट हेर्नुहोस्।"If the question is not in Nepali, respond:"कृपया नेपाली भाषामा प्रश्न सोध्नुहोस्।"User Question:${text}
`;
    const response = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        safetySettings: safetySettings,
      },
    });
    for await (const chunk of response) {
      setAnswer((prev) => prev + chunk.text);
    }
    mutation.mutate();
  };
  // const chat = ai.chats.create({
  //   model: MODEL_NAME,
  //   history: [
  //     {
  //       role: "user",
  //       parts: [{ text: "Hello" }],
  //     },
  //     {
  //       role: "model",
  //       parts: [{ text: "Great to meet you. What would you like to know?" }],
  //     },
  //   ],
  // });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    add(text);
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
      <div className="pb-[100px]" ref={endRef}>
        {/* Form */}
        <form
          ref={formRef}
          className="w-1/2 absolute bottom-3 bg-[#2c2937] rounded-2xl flex items-center px-4"
          onSubmit={handleSubmit}
        >
          {/* input */}
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
