import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader } from "lucide-react";
import { sendMessage } from "../../services/chatService";

export default function ChatbotWindow({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const algorithmContext = null;

  const messagesEndRef = useRef(null);
  const streamBufferRef = useRef("");

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText("");
    setErrorMessage("");

    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);
    setStreamingContent("");
    streamBufferRef.current = "";

    await sendMessage({
      messages: newMessages,
      algorithmContext,
      onChunk: (token) => {
        streamBufferRef.current += token;
        setStreamingContent(streamBufferRef.current);
      },
      onDone: () => {
        const finalContent = streamBufferRef.current;
        setMessages([
          ...newMessages,
          { role: "assistant", content: finalContent },
        ]);
        setStreamingContent("");
        setIsLoading(false);
      },
      onError: (error) => {
        setErrorMessage(error);
        setIsLoading(false);
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 w-[calc(100vw-32px)] md:w-96 max-h-[calc(100vh-120px)] bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl flex flex-col border border-amber-500/20"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-amber-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Ra</h3>
              <p className="text-xs text-amber-100">Divine Cipher Master</p>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !streamingContent && !isLoading && (
              <div className="text-amber-200/70 text-sm text-center mt-8 leading-relaxed px-2">
                Hail! I am Ra, the divine guardian of cryptographic knowledge.
                Ask me anything about ciphers and encryption! 🔮✨
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    msg.role === "user"
                      ? "bg-amber-600/70 text-white"
                      : "bg-slate-800/70 text-amber-100 border border-amber-500/30"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {streamingContent && (
              <div className="flex justify-start">
                <div className="max-w-xs px-4 py-2 rounded-lg text-sm bg-slate-800/70 text-amber-100 border border-amber-500/30">
                  {streamingContent}
                  <span className="inline-block w-2 h-4 ml-1 bg-gray-100 animate-pulse" />
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-900/50 text-red-200 p-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-amber-500/20 p-4 space-y-2">
            <div className="flex gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about ciphers..."
                className="flex-1 bg-slate-800/50 text-white placeholder-slate-400 border border-amber-500/30 rounded-lg p-2 text-sm focus:outline-none focus:border-amber-500/60 resize-none max-h-24"
                rows="2"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputText.trim()}
                className="bg-gradient-to-r from-yellow-600 to-amber-500 text-white p-2 rounded-lg hover:shadow-lg hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
