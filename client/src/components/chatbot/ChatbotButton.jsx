import { motion } from "framer-motion";

export default function ChatbotButton({ isOpen, onOpen }) {
  if (isOpen) return null;

  const rays = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 360) / 12;
    const delay = i * 0.15;
    return { angle, delay };
  });

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={onOpen}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-600 to-amber-500 text-white shadow-2xl flex items-center justify-center hover:shadow-[0_0_50px_rgba(217,119,6,0.7)] transition-shadow duration-300"
      title="Ask Ra anything"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {rays.map(({ angle, delay }) => (
          <motion.div
            key={angle}
            className="absolute w-1 bg-gradient-to-t from-yellow-400/0 via-yellow-400/70 to-yellow-400/0"
            style={{
              height: "140%",
              transform: `rotate(${angle}deg)`,
              transformOrigin: "center center",
              borderRadius: "999px",
            }}
            animate={{
              opacity: [0.2, 0.7, 0.2],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 2.5,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <svg
        className="w-10 h-10 relative z-10"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M 20 30 Q 50 15 80 30" stroke="white" strokeWidth="3" />
        <circle cx="50" cy="55" r="18" fill="white" />
        <circle cx="50" cy="55" r="12" fill="#1a2035" />
        <circle cx="52" cy="52" r="4" fill="white" opacity="0.9" />
        <line x1="30" y1="75" x2="25" y2="85" stroke="white" strokeWidth="2.5" />
        <line x1="50" y1="75" x2="50" y2="87" stroke="white" strokeWidth="2.5" />
        <line x1="70" y1="75" x2="75" y2="85" stroke="white" strokeWidth="2.5" />
      </svg>
    </motion.button>
  );
}
