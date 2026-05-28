import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function ChatbotButton({ isOpen, onOpen }) {
  if (isOpen) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onOpen}
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-600 to-amber-500 text-white shadow-2xl flex items-center justify-center hover:shadow-[0_0_30px_rgba(217,119,6,0.6)] transition-shadow"
      title="Ask Ra anything"
    >
      {/* Custom Eye of Ra SVG */}
      <svg
        className="w-8 h-8"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Eyebrow */}
        <path d="M 20 30 Q 50 15 80 30" stroke="white" strokeWidth="3" />

        {/* Iris circle */}
        <circle cx="50" cy="55" r="18" fill="white" />

        {/* Pupil with highlight */}
        <circle cx="50" cy="55" r="12" fill="#1a2035" />
        <circle cx="52" cy="52" r="4" fill="white" opacity="0.8" />

        {/* Lower eyelash lines */}
        <line x1="30" y1="75" x2="25" y2="85" stroke="white" strokeWidth="2" />
        <line x1="50" y1="75" x2="50" y2="87" stroke="white" strokeWidth="2" />
        <line x1="70" y1="75" x2="75" y2="85" stroke="white" strokeWidth="2" />
      </svg>
    </motion.button>
  );
}
