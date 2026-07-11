import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: "#2dd4a0",
  error: "#e05252",
  info: "#5b9bd5",
};

export default function Toast({ message, type = "info", onClose }) {
  const Icon = icons[type] || icons.info;
  const color = colors[type] || colors.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-1.5rem)]"
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border font-mono"
        style={{
          backgroundColor: "#131a26",
          borderColor: color,
          color: color,
        }}
      >
        <Icon size={18} />
        <span className="text-sm">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 opacity-60 hover:opacity-100 text-realm-muted"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}
