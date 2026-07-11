import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader } from "lucide-react";
import { sendMessage } from "../../services/chatService";

const MIN_WIDTH = 320;
const MIN_HEIGHT = 400;
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 540;

export default function ChatbotWindow({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [windowSize, setWindowSize] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const messagesEndRef = useRef(null);
  const streamBufferRef = useRef("");
  const resizeRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  useEffect(() => {
    const updateMobileState = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  const handleResizeStart = useCallback(
    (e) => {
      e.preventDefault();
      startPos.current = {
        x: e.clientX,
        y: e.clientY,
        w: windowSize.width,
        h: windowSize.height,
      };
      setIsResizing(true);
    },
    [windowSize],
  );

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e) => {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      const newW = Math.max(MIN_WIDTH, startPos.current.w + dx);
      const newH = Math.max(MIN_HEIGHT, startPos.current.h + dy);
      const maxW = window.innerWidth - 48;
      const maxH = window.innerHeight - 100;
      setWindowSize({
        width: Math.min(newW, maxW),
        height: Math.min(newH, maxH),
      });
    };
    const handleMouseUp = () => setIsResizing(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

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
      algorithmContext: null,
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
          style={{
            ...(isMobile
              ? {}
              : {
                  width: windowSize.width,
                  height: windowSize.height,
                }),
          }}
          className={`fixed z-50 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl flex flex-col border border-amber-500/30 overflow-hidden ${
            isMobile
              ? "top-16 left-3 right-3 bottom-3"
              : "bottom-4 right-4 md:bottom-8 md:right-8"
          }`}
        >
          {/* Header with Eye of Ra */}
          <div className="bg-gradient-to-r from-yellow-700 via-amber-600 to-amber-500 text-white p-3 md:p-4 flex justify-between items-center shrink-0 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <svg
                className="w-7 h-7 md:w-8 md:h-8"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 20 30 Q 50 15 80 30"
                  stroke="white"
                  strokeWidth="3"
                />
                <circle cx="50" cy="55" r="18" fill="white" />
                <circle cx="50" cy="55" r="12" fill="#1a2035" />
                <circle cx="52" cy="52" r="4" fill="white" opacity="0.9" />
                <line
                  x1="30"
                  y1="75"
                  x2="25"
                  y2="85"
                  stroke="white"
                  strokeWidth="2"
                />
                <line
                  x1="50"
                  y1="75"
                  x2="50"
                  y2="87"
                  stroke="white"
                  strokeWidth="2"
                />
                <line
                  x1="70"
                  y1="75"
                  x2="75"
                  y2="85"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
              <div>
                <h3 className="font-bold text-lg font-cinzel tracking-wide">
                  Ra
                </h3>
                <p className="text-[10px] text-amber-200 uppercase tracking-widest opacity-80">
                  Divine Cipher Master
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gradient-to-b from-slate-900/90 to-slate-950/90">
            {messages.length === 0 && !streamingContent && !isLoading && (
              <div className="text-amber-200/60 text-sm text-center mt-6 md:mt-8 leading-relaxed px-2 md:px-4 font-cinzel">
                <p className="text-base md:text-lg text-amber-300/80 mb-2">
                  Hail, Traveler!
                </p>
                <p className="text-amber-200/50">
                  I am Ra, divine guardian of cryptographic knowledge.
                </p>
                <p className="text-amber-200/50 mt-1">
                  Ask me anything about ciphers and encryption.
                </p>
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
                  className={`max-w-[85%] md:max-w-xs px-3 md:px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-amber-600/80 text-white shadow-lg shadow-amber-900/30"
                      : "bg-slate-800/70 text-amber-100 border border-amber-500/20 shadow-lg"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {streamingContent && (
              <div className="flex justify-start">
                <div className="max-w-[85%] md:max-w-xs px-3 md:px-4 py-2.5 rounded-lg text-sm leading-relaxed bg-slate-800/70 text-amber-100 border border-amber-500/20 shadow-lg">
                  {streamingContent}
                  <span className="inline-block w-2 h-4 ml-1 bg-amber-400 animate-pulse rounded-sm" />
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-900/60 text-red-200 p-3 rounded-lg text-sm border border-red-500/30">
                {errorMessage}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-amber-500/20 p-3 md:p-4 shrink-0 bg-slate-950/80">
            <div className="flex gap-2 items-end">
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
                className="flex-1 bg-slate-800/50 text-white placeholder-slate-400 border border-amber-500/20 rounded-lg p-2.5 text-sm focus:outline-none focus:border-amber-500/60 resize-none max-h-24 transition-colors"
                rows="2"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputText.trim()}
                className="bg-gradient-to-r from-yellow-600 to-amber-500 text-white p-2.5 rounded-lg hover:shadow-lg hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
              >
                {isLoading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Resize Handle */}
          <div
            ref={resizeRef}
            onMouseDown={handleResizeStart}
            className="hidden md:flex absolute bottom-0 right-0 w-6 h-6 cursor-se-resize items-center justify-center group"
          >
            <div className="text-amber-500/40 group-hover:text-amber-400/70 transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M14 10L10 14M14 6L6 14M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
