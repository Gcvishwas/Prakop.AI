import { useQuery } from "@tanstack/react-query";
import NewPrompt from "../../Components/newPrompt/NewPrompt";
import { useLocation } from "react-router";
import Markdown from "react-markdown";
import Loader from "../../Components/Loader";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { isLoading, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chat/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className="h-full flex flex-col items-center relative">
      <div className="flex-1 overflow-y-auto w-full flex justify-center">
        <div className="w-1/2 flex flex-col gap-5">
          {isLoading ? (
            <Loader />
          ) : error ? (
            "Can't fetch chat"
          ) : (
            data?.history?.map((message, i) => (
              <div
                key={i}
                className={`bg-[#3a3a3a] rounded-2xl max-w-[80%] p-4 mt-2 ${
                  message.role === "user" ? "self-end" : "self-start"
                }`}
              >
                <Markdown>{message.parts[0].text}</Markdown>
              </div>
            ))
          )}
          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
