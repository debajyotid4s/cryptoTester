import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import {
  fetchAlgorithmFact,
  getLocalAlgorithmFact,
} from "../../services/factService";

export default function AlgorithmFact({ algo, kingdom, cipher, theme, onDismiss }) {
  const [fact, setFact] = useState(() => getLocalAlgorithmFact(kingdom, cipher));
  const [error, setError] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setFact(getLocalAlgorithmFact(kingdom, cipher));
    setError(null);
    setDismissed(false);

    fetchAlgorithmFact(kingdom, cipher)
      .then((text) => {
        if (mountedRef.current) {
          setFact(text);
        }
      })
      .catch((err) => {
        if (mountedRef.current) {
          setError(err.message);
        }
      });

    return () => { mountedRef.current = false; };
  }, [algo]);

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl border p-6 mb-8"
          style={{
            borderColor: `${theme.color}60`,
            boxShadow: `
              0 0 30px ${theme.color}20,
              0 0 60px ${theme.color}10,
              inset 0 0 30px ${theme.color}08
            `,
            background: `linear-gradient(135deg, ${theme.color}08 0%, transparent 50%, ${theme.color}05 100%)`,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, ${theme.color}15 0%, transparent 60%)`,
            }}
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${theme.color}20`,
                    boxShadow: `0 0 20px ${theme.color}30`,
                  }}
                >
                  <BookOpen size={20} style={{ color: theme.color }} />
                </div>
                <div>
                  <h3
                    className="font-cinzel text-lg font-bold tracking-wide"
                    style={{ color: theme.color }}
                  >
                    {kingdom}
                  </h3>
                  <p className="text-xs text-realm-muted font-mono tracking-wider uppercase">
                    {cipher} — Historical Record
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-realm-muted hover:text-realm-text transition-colors p-1 rounded-lg hover:bg-white/5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="relative">
              {error && null}

              {fact && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="prose prose-sm max-w-none"
                >
                  <p className="text-realm-text/90 leading-relaxed text-sm font-mono whitespace-pre-line">
                    {fact}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${theme.color}15 0%, transparent 70%)`,
              filter: "blur(20px)",
            }}
          />
          <div
            className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${theme.color}10 0%, transparent 70%)`,
              filter: "blur(15px)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
