import { useState, useRef, useEffect } from "react";
import type { Message } from "../schemas/Chat";
import { scrollToBottom } from "../utils/scrollToBottom";
import { BACK_END_URL } from "../utils/constants";
import io from "socket.io-client";
import { SendSvg } from "./icons/SendSvg";
import { ChatSvg } from "./icons/ChatSvg";
import { getToken } from "../store/token";
import { getAllMessages } from "../services/messages/getAllMessages";
import { formatRelativeDate } from "../utils/formatRelativeDate";
import { createMessage } from "../services/messages/createMessage";
import { useNavigate } from "react-router-dom";

const socket = io(BACK_END_URL);

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    getAllMessages()
      .then((msgs) => {
        console.log("Mensajes recibidos:", msgs);
        setMessages(msgs);
      })
      .catch(console.error);

    const token = getToken();
    if (token) {
      const parsed = JSON.parse(token);
      setUser(parsed.user);
      console.log(parsed.user);
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages]);

  const receivedMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message: Message = {
        content: newMessage,
        sender: { _id: user._id, username: user.username },
        createdAt: new Date().toISOString(),
      };

      socket.emit("message", message);
      setNewMessage("");
      await createMessage(message);
      setMessages((prev) => [...prev, message]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    socket.on("message", receivedMessage);
    return () => {
      socket.off("message", receivedMessage);
    };
  }, []);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      <div
        className={`flex-1 flex flex-col transition-all duration-300 
          `}
      >
        <div className="flex-1 flex flex-col bg-white m-4 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <ChatSvg classNames="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Chatea </h1>
              <p className="text-blue-100 text-sm"></p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${
                  message.sender._id === user._id
                    ? "justify-end"
                    : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                    message.sender._id === user._id
                      ? "flex-row-reverse space-x-reverse"
                      : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                      message.sender._id === user._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {message.sender._id === user._id
                      ? "Tú"
                      : message.sender.username.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-md relative ${
                        message.sender._id === user._id
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                      }`}
                    >
                      <div
                        className={`absolute bottom-0 w-3 h-3 ${
                          message.sender._id === user._id
                            ? "right-0 bg-blue-600 rounded-bl-full"
                            : "left-0 bg-white border-l border-b border-gray-200 rounded-br-full"
                        }`}
                      />
                      <p className="text-sm leading-relaxed relative z-10">
                        {message.content}
                      </p>
                    </div>
                    <p
                      className={`text-xs mt-1 px-2 ${
                        message.sender._id === user._id
                          ? "text-right text-gray-500"
                          : "text-left text-gray-500"
                      }`}
                    >
                      {formatRelativeDate(message.createdAt as string)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

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
