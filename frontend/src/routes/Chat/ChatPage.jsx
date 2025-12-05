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
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className="h-full flex flex-col items-center relative">
      <div className="flex-1 overflow-y-auto w-full flex justify-center">
        <div className="w-1/2 flex flex-col gap-5 pb-32">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <div className="text-red-500 p-4">Can't fetch chat</div>
          ) : (
            <>
              {/* Display all historical messages except the initial one (shown by NewPrompt) */}
              {data?.history?.slice(1).map((message, i) => (
                <div
                  className={
                    message.role === "user"
                      ? "bg-[#2c2937] rounded-2xl max-w-[80%] self-end p-5"
                      : "bg-[#2c2937] rounded-2xl max-w-[80%] self-start p-5"
                  }
                  key={i}
                >
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              ))}
              {/* NewPrompt handles new messages and displays them */}
              {data && <NewPrompt data={data} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
