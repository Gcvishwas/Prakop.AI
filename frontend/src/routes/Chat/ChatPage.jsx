import { useQuery } from "@tanstack/react-query";
import NewPrompt from "../../Components/newPrompt/NewPrompt";
import { useLocation } from "react-router";
import Markdown from "react-markdown";
import Loader from "../../Components/Loader";

const ChatPage = () => {
  const chatId = useLocation().pathname.split("/").pop();

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
        <div className="w-1/2 flex flex-col gap-5 pb-32">
          {isLoading && <Loader />}
          {error && <div className="text-red-500 p-4">No Chats Found</div>}

          {/* Render full history */}
          {!isLoading &&
            !error &&
            data?.history?.map((message, i) => (
              <div
                key={i}
                className={
                  message.role === "user"
                    ? "bg-[#2c2937] rounded-2xl max-w-[80%] self-end p-5"
                    : "bg-[#2c2937] rounded-2xl max-w-[80%] self-start p-5"
                }
              >
                <Markdown>{message.parts[0].text}</Markdown>
              </div>
            ))}

          {/* Message input + streaming */}
          {!isLoading && !error && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
