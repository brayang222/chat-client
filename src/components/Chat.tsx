import { useState, useRef, useEffect } from "react";
import type { Message } from "../schemas/Chat";
import { scrollToBottom } from "../utils/scrollToBottom";
import io from "socket.io-client";
const socket = io("http://localhost:3000");

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there! How's it going?",
      sender: "other",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "2",
      text: "Hi! I'm doing great, thanks for asking. How about you?",
      sender: "user",
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: "3",
      text: "Pretty good! Just working on some projects. What are you up to today?",
      sender: "other",
      timestamp: new Date(Date.now() - 180000),
    },
    {
      id: "4",
      text: "Same here! Always something interesting to work on 😊",
      sender: "user",
      timestamp: new Date(Date.now() - 120000),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [currentChatId, setCurrentChatId] = useState("1");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      console.log(message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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
              {/* <User className="w-6 h-6" /> */}
            </div>
            <div>
              <h1 className="text-xl font-semibold">Chat Interface</h1>
              <p className="text-blue-100 text-sm">Online now</p>
            </div>
          </div>

          <section className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.sender === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
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
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-600"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* <Send className="w-5 h-5" /> */}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
