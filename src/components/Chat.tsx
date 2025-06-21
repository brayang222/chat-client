import { useState, useRef, useEffect } from "react";
import type { BodyMessage, Message } from "../schemas/Chat";
import { scrollToBottom } from "../utils/scrollToBottom";
import { BACK_END_URL } from "../utils/constants";
import { useParams } from "react-router-dom";
import { getUserByUsername } from "../services/users/getUserByUsername";
import io from "socket.io-client";
import { UserSvg } from "./icons/UserSvg";
import { SendSvg } from "./icons/SendSvg";

const socket = io(BACK_END_URL);

export const Chat = () => {
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [currentChatId, setCurrentChatId] = useState("1");

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { userParams } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const userFectched = await getUserByUsername(userParams);
      setUser(userFectched);
      console.log(`User fetched: ${userFectched}`);
    };
    fetchUser();
  }, [user]);

  useEffect(() => {
    scrollToBottom(messagesEndRef);
    console.log(`socket ID: ${socket.id}`);
  }, [messages]);

  const receivedMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    console.log(message);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const bodyMessage: BodyMessage = {
        id: Date.now().toString(),
        text: newMessage,
        sender: socket.id as string,
        timestamp: new Date(),
      };
      const message: Message = {
        body: bodyMessage,
        from: socket.id as string,
      };
      socket.emit("message", bodyMessage);
      setNewMessage("");
      setMessages([...messages, message]);
    }
  };

  useEffect(() => {
    socket.on("message", receivedMessage);

    return () => {
      socket.off("message", receivedMessage);
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // const formatTime = (date: Date) => {
  //   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  // };

  // const handleChatSelect = (chatId: string) => {
  //   setCurrentChatId(chatId);
  //   // Here you would typically load messages for the selected chat
  //   console.log("Selected chat:", chatId);
  // };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      {/* <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentChatId={currentChatId}
        onChatSelect={handleChatSelect}
      /> */}

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 
          `}
      >
        <div className="flex-1 flex flex-col bg-white m-4 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <UserSvg classNames="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Chat </h1>
              <p className="text-blue-100 text-sm">Online now</p>
            </div>
          </div>

          <section className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${
                  message.from === socket.id ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    message.from === socket.id
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed">
                    {message.from} text: {message.body.text}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.body === socket.id
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {/* {formatTime(message.body.timestamp)} */}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </section>

          <section className="p-6 bg-white border-t border-gray-200">
            <div className="flex space-x-4 items-end">
              <div className="flex-1">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tú mensaje..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-600"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendSvg />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
