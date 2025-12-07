import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import Loader from "../Loader";
import { useAuth } from "@clerk/clerk-react";
const ChatList = () => {
  const { getToken } = useAuth();
  const { isLoading, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/userChats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json();
    },
  });

  return (
    <div className="flex flex-col h-full">
      <span className="title font-semibold text-[10px] mb-2.5">DASHBOARD</span>
      <Link to="/dashboard" className="p-2.5 rounded-[10px] hover:bg-[#2c2937]">
        Create a new Chat
      </Link>
      <Link to="/" className="p-2.5 rounded-[10px] hover:bg-[#2c2937]">
        Explore
      </Link>
      <Link to="/" className="p-2.5 rounded-[10px] hover:bg-[#2c2937]">
        Contact
      </Link>
      <hr className="border-none h-[2px] bg-[#ddd] opacity-10 rounded-[5px] my-5" />
      {/* Recent Chats */}
      <span className="title font-semibold text-[10px] mb-2.5">
        RECENT CHATS
      </span>
      <div className="flex flex-col overflow-y-auto scrollbar-hide">
        {isLoading ? (
          <Loader />
        ) : error ? (
          "No chats found"
        ) : (
          data?.map((chat) => (
            <Link
              to={`dashboard/chats/${chat._id}`}
              className="p-1.5 rounded-[10px] hover:bg-[#2c2937]"
              key={chat._id}
            >
              {chat.title}
            </Link>
          ))
        )}
      </div>
      <hr className="border-none h-[2px] bg-[#ddd] opacity-10 rounded-[5px] my-5" />
      <div className="upgrade mt-auto flex items-center gap-2 text-[12px]">
        <img src="/vite.svg" alt="logo" className="w-6 h-6" />
        <div className="texts flex flex-col">
          <span className="font-semibold">Upgrade </span>
          <span className="text-[#888]">New Features coming soon!!!</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
