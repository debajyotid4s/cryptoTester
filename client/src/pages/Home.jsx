import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FantasyMap from "../components/map/FantasyMap";
import ChatbotButton from "../components/chatbot/ChatbotButton";
import ChatbotWindow from "../components/chatbot/ChatbotWindow";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="w-full h-full relative">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsChatOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="w-full h-full"
      >
        <FantasyMap isChatOpen={isChatOpen} />
        <ChatbotButton isOpen={isChatOpen} onOpen={() => setIsChatOpen(true)} />
        <ChatbotWindow
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      </motion.div>
    </div>
  );
}
