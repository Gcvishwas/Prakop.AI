import NewPrompt from "../../Components/newPrompt/NewPrompt";

const ChatPage = () => {
  return (
    <div className="h-full flex flex-col items-center relative">
      <div className="flex-1 overflow-y-auto w-full flex justify-center">
        <div className="w-1/2 flex flex-col gap-5">
          <div className="bg-[#2c2937] rounded-2xl max-w-[80%] self-end mt-2 p-5">
            Test Message
          </div>
          <div className="bg-[#3a3a3a] rounded-2xl max-w-[80%] self-start p-5">
            Test Message from user
          </div>
          <div className="bg-[#2c2937] rounded-2xl max-w-[80%] self-end mt-2 p-5">
            Test Message
          </div>
          <div className="bg-[#3a3a3a] rounded-2xl max-w-[80%] self-start p-5">
            Test Message from user
          </div>
          <div className="bg-[#2c2937] rounded-2xl max-w-[80%] self-end mt-2 p-5">
            Test Message
          </div>
          <div className="bg-[#3a3a3a] rounded-2xl max-w-[80%] self-start p-5">
            Test Message from user
          </div>
          <div className="bg-[#2c2937] rounded-2xl max-w-[80%] self-end mt-2 p-5">
            Test Message
          </div>
          <div className="bg-[#3a3a3a] rounded-2xl max-w-[80%] self-start p-5">
            Test Message from user
          </div>
          <div className="bg-[#2c2937] rounded-2xl max-w-[80%] self-end mt-2 p-5">
            Test Message
          </div>
          <div className="bg-[#3a3a3a] rounded-2xl max-w-[80%] self-start p-5">
            Test Message from user
          </div>
          <div className="bg-[#2c2937] rounded-2xl max-w-[80%] self-end mt-2 p-5">
            Test Message
          </div>
          <div className="bg-[#3a3a3a] rounded-2xl max-w-[80%] self-start p-5">
            Test Message from user
          </div>
          <div className="bg-[#2c2937] rounded-2xl max-w-[80%] self-end mt-2 p-5">
            Test Message
          </div>
          <div className="bg-[#3a3a3a] rounded-2xl max-w-[80%] self-start p-5">
            Test Message from user
          </div>
          <NewPrompt />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
