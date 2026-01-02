import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, User, X, Info } from "lucide-react";

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch(
        "https://ai-chat-smoky-pi.vercel.app/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            history: messages,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.response },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: `خطا: ${data.error}` },
        ]);
      }
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "خطا در اتصال به سرور. لطفاً دوباره امتحان کنید.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                هوش مصنوعی علی حیدری
              </h1>
              <p className="text-xs text-gray-500">دستیار شخصی شما</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="اطلاعات پروژه"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full h-[400px] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                اطلاعات پروژه
              </h2>
              <div className="h-1 w-16 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-3 text-right" dir="rtl">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">عنوان پروژه</p>
                <p className="text-base font-medium text-gray-800">
                  سیستم چت هوشمند
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">دانشجو</p>
                <p className="text-base font-medium text-gray-800">علی حیدری</p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">استاد راهنما</p>
                <p className="text-base font-medium text-gray-800">
                  استاد زهدی
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">نوع پروژه</p>
                <p className="text-base font-medium text-gray-800">
                  پروژه دانشگاهی
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">تکنولوژی‌ها</p>
                <p className="text-base text-gray-800">
                  React.js • Node.js • Express
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <p className="text-lg font-medium">
                سلام! چطور می‌تونم کمکتون کنم؟
              </p>
              <p className="text-sm mt-2">سوال خود را بپرسید...</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-lg shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 rounded-bl-none">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="پیام خود را بنویسید..."
            disabled={loading}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all text-right"
            dir="rtl"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={`px-6 py-3 rounded-lg transition-all flex items-center gap-2 shadow-sm font-medium ${
              loading || !input.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Send className="w-5 h-5" />
            ارسال
          </button>
        </div>
      </div>
    </div>
  );
}
