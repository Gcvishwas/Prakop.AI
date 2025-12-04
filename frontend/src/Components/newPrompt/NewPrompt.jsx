import { useEffect, useRef, useState } from "react";
import { ai, MODEL_NAME, safetySettings } from "../../lib/gemini";
import Markdown from "react-markdown";
const NewPrompt = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  const add = async (text) => {
    setQuestion(text);
    console.log("Thinking....promptly");
    const prompt = `Your job is to correct the output given by a trained gpt-2 model in Nepali.Reply only in Nepali.Ensure the text is coherent, natural, and relevant to disasters in Nepal.If irrelevant, respond:"मसँग विपद्सँग सम्बन्धित सीमित जानकारी मात्र छ। अन्य प्रश्नहरूको लागि इन्टरनेट हेर्नुहोस्।"If the question is not in Nepali, respond:"कृपया नेपाली भाषामा प्रश्न सोध्नुहोस्।"User Question:${text}
`;
    const response = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        safetySettings: safetySettings,
      },
    });
    for await (const chunk of response) {
      console.log(chunk.text);
      setAnswer((prev) => prev + chunk.text);
    }
  };
  const chat = ai.chats.create({
    model: MODEL_NAME,
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    add(text);
  };
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
