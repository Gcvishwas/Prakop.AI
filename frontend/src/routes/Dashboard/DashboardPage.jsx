import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    await fetch("http://localhost:3000/api/chats", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, text }),
    });
  };
  return (
    <div className="h-full flex flex-col items-center">
      <div className="flex flex-col flex-1 items-center justify-center  w-1/2 gap-12">
        <div className="flex items-center gap-5 opacity-2">
          {/* Logo */}
          <img src="/vite.svg" className="w-16 h-16" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-[#217bfe] to-[#e55571] bg-clip-text text-transparent">
            प्रकोप.AI
          </h1>
        </div>
        {/* Options */}
        <div className="flex gap-12 items-center justify-between w-full">
          <div className=" flex flex-col gap-2 font-light text-sm p-5 border border-[#555] rounded-2xl flex-1">
            <img src="/chat.png" alt="" className="w-10 h-10 object-cover" />
            <span>नयाँ च्याट</span>
          </div>
          <div className="flex flex-col gap-2 font-light text-sm p-5 border border-[#555] rounded-2xl flex-1">
            <img src="/image.png" alt="" className="w-10 h-10 object-cover" />
            <span>जानकारी</span>
          </div>
          <div className="flex flex-col gap-2 font-light text-sm p-5 border border-[#555] rounded-2xl flex-1">
            <img src="/code.png" alt="" className="w-10 h-10 object-cover" />
            <span>सुझाव</span>
          </div>
        </div>
      </div>
      {/* Input form */}
      <div className="flex  bg-[#2c2937] w-1/2 mt-auto rounded-2xl">
        <form
          className="flex w-full h-full items-center justify-between gap-5 mb-2"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="प्रश्न सोध्नुहोस...."
            name="text"
            className="p-5 flex-1 border-none outline-none bg-transparent placeholder-gray-400 text-[#ececec]"
          />
          <button
            type="submit"
            className={`bg-[#605e68] rounded-full cursor-pointer p-3 mr-5 flex items-center justify-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin border-b-2 h-4 w-4 rounded-full border-white"></div>
            ) : (
              <img src="/arrow.png" alt="" className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
