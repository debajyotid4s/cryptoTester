import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Copy, Shuffle, AlertCircle, RefreshCw } from "lucide-react";
import {
  CIPHER_ALGORITHMS,
  encrypt,
  decrypt,
  generateKeys,
} from "../services/cryptoService";
import Toast from "../components/ui/Toast";
import KeyFactorCard from "../components/cipher/KeyFactorCard";
import AlgorithmFact from "../components/cipher/AlgorithmFact";
import NumberInput from "../components/ui/NumberInput";
import ChatbotButton from "../components/chatbot/ChatbotButton";
import ChatbotWindow from "../components/chatbot/ChatbotWindow";

const KINGDOM_THEMES = {
  rsa: {
    color: "#e05252",
    light: "#f87575",
    name: "Iron Sanctum",
    borderClass: "kingdom-border-iron",
    textClass: "kingdom-text-iron",
  },
  vigenere: {
    color: "#2dd4a0",
    light: "#5eead4",
    name: "Emerald Archives",
    borderClass: "kingdom-border-emerald",
    textClass: "kingdom-text-emerald",
  },
  playfair: {
    color: "#5b9bd5",
    light: "#93c5fd",
    name: "Frost Citadel",
    borderClass: "kingdom-border-frost",
    textClass: "kingdom-text-frost",
  },
  hill: {
    color: "#f5a623",
    light: "#fcd34d",
    name: "Golden Kingdom",
    borderClass: "kingdom-border-gold",
    textClass: "kingdom-text-gold",
  },
};

const SAMPLE_TEXTS = ["HELLO", "LATEYX", "ATTACKATDAWN"];

export default function CipherRoom() {
  const { algo } = useParams();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [params, setParams] = useState(getDefaultParams(algo));
  const [isChatOpen, setIsChatOpen] = useState(false);

  const cipherData = CIPHER_ALGORITHMS[algo];
  const theme = KINGDOM_THEMES[algo] || KINGDOM_THEMES.rsa;
  const [rsaKeys, setRsaKeys] = useState(null);

  useEffect(() => {
    setParams(getDefaultParams(algo));
    setInputText("");
    setOutputText("");
    setError(null);
    setRsaKeys(null);
    if (algo === "rsa") handleGenerateKeys();
  }, [algo]);

  function getDefaultParams(algoId) {
    switch (algoId) {
      case "rsa":
        return {};
      case "vigenere":
      case "playfair":
        return { key: "CIPHER", padChar: "X", stripPadding: true };
      case "hill":
        return {
          matrix: [
            [3, 3],
            [2, 5],
          ],
          padChar: "X",
          stripPadding: true,
        };
      default:
        return {};
    }
  }

  const handleGenerateKeys = async () => {
    try {
      const data = await generateKeys("rsa");
      setRsaKeys(data.keys);
      showToast("New RSA key pair generated", "success");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      setError("Please enter text to encrypt");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const startTime = performance.now();
      const encryptParams =
        algo === "rsa" && rsaKeys
          ? {
              e: rsaKeys.e,
              n: rsaKeys.n,
              p: rsaKeys.p,
              q: rsaKeys.q,
              phi: rsaKeys.phi,
            }
          : params;
      const data = await encrypt(algo, inputText.toUpperCase(), encryptParams);
      const endTime = performance.now();
      setOutputText(data.result);
      setLastResult({ ...data, rsaKeys });
      showToast(
        `Encrypted in ${(endTime - startTime).toFixed(2)}ms`,
        "success",
      );
    } catch (err) {
      setError(err.message);
      setOutputText("");
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!inputText.trim()) {
      setError("Please enter text to decrypt");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const startTime = performance.now();
      const decryptParams =
        algo === "rsa" && rsaKeys
          ? {
              d: rsaKeys.d,
              n: rsaKeys.n,
              p: rsaKeys.p,
              q: rsaKeys.q,
              phi: rsaKeys.phi,
            }
          : { ...params };
      if (
        algo !== "rsa" &&
        params.stripPadding &&
        lastResult?.explain?.padAdded
      ) {
        decryptParams.padAdded = lastResult.explain.padAdded;
      }
      if (
        algo !== "rsa" &&
        params.stripPadding &&
        lastResult?.explain?.padAddedPerWord
      ) {
        decryptParams.padAddedPerWord = lastResult.explain.padAddedPerWord;
      }
      const data = await decrypt(algo, inputText.toUpperCase(), decryptParams);
      const endTime = performance.now();
      setOutputText(data.result);
      setLastResult(data);
      showToast(
        `Decrypted in ${(endTime - startTime).toFixed(2)}ms`,
        "success",
      );
    } catch (err) {
      setError(err.message);
      setOutputText("");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      showToast("Copied to clipboard", "success");
    } catch {}
  };

  const handleSwap = () => {
    if (!outputText) return;
    setInputText(outputText);
    setOutputText("");
    setLastResult(null);
  };

  if (!cipherData) {
    return (
      <div className="text-center py-20">
        <h2 className="font-cinzel text-2xl kingdom-text-iron">
          Realm not found
        </h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-3 bg-realm-surface rounded-xl border border-realm-border font-cinzel"
        >
          Return to Map
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-full relative"
      style={{
        background: `radial-gradient(circle at 50% 30%, ${theme.color}08 0%, transparent 50%)`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-10 md:pb-12">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-realm-muted hover:text-realm-text mb-6 md:mb-8 transition-colors font-mono"
        >
          <MapPin size={18} className={theme.textClass} />
          <span className="text-sm">Return to Realm Map</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1
            className={`font-cinzel text-3xl sm:text-4xl md:text-6xl font-bold mb-3 tracking-wide leading-tight`}
            style={{
              background: `linear-gradient(135deg, ${theme.color}ff 0%, ${theme.light}cc 50%, ${theme.color}99 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: `0 0 40px ${theme.color}40`,
              filter: `drop-shadow(0 0 20px ${theme.color}30)`,
            }}
          >
            {cipherData.name}
          </h1>
          <p
            className="text-[10px] sm:text-sm md:text-base font-cinzel tracking-[0.2em] sm:tracking-[0.25em] uppercase font-semibold"
            style={{
              color: theme.color,
              opacity: 0.8,
              textShadow: `0 0 15px ${theme.color}40`,
            }}
          >
            {cipherData.realm}
          </p>

          <div className="flex justify-center my-6 md:my-8">
            <div className="relative w-52 sm:w-64 md:w-80">
              <div
                className="h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${theme.color}40 20%, ${theme.color}40 80%, transparent)`,
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-realm-bg px-4 sm:px-6">
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle, ${theme.color}20 0%, transparent 70%)`,
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={theme.color}
                    opacity="0.7"
                  >
                    <circle cx="12" cy="12" r="8" opacity="0.3" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <AlgorithmFact
          algo={algo}
          kingdom={theme.name}
          cipher={cipherData.realm}
          theme={theme}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`parchment-bg rounded-2xl p-5 md:p-8 border border-realm-border ${theme.borderClass}`}
          >
            <label className="block text-sm text-realm-muted mb-3 font-cinzel uppercase tracking-wider">
              Cipher Text
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value.toUpperCase())}
              placeholder="Enter text (A-Z and spaces)"
              className="w-full h-40 sm:h-48 md:h-56 bg-realm-bg border-2 rounded-xl p-4 md:p-5 text-base md:text-lg text-realm-text font-cinzel resize-none transition-all duration-300 focus:outline-none hover:shadow-lg"
              style={{
                borderColor: theme.color,
                boxShadow: `inset 0 0 20px ${theme.color}10, 0 0 15px ${theme.color}20`,
              }}
            />

            <div className="flex gap-2 mt-4 flex-wrap">
              {SAMPLE_TEXTS.map((text) => (
                <button
                  key={text}
                  onClick={() => setInputText(text)}
                  className="px-3 py-2 text-xs sm:text-sm rounded-lg font-cinzel font-semibold transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border"
                  style={{
                    borderColor: theme.color,
                    color: theme.color,
                    backgroundColor: `${theme.color}15`,
                  }}
                >
                  {text}
                </button>
              ))}
            </div>

            <ParameterFields
              algo={algo}
              params={params}
              onChange={setParams}
              theme={theme}
              rsaKeys={rsaKeys}
              onGenerateKeys={handleGenerateKeys}
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
              <button
                onClick={handleEncrypt}
                disabled={loading}
                className="flex-1 py-3 md:py-4 rounded-xl font-cinzel font-bold text-sm sm:text-base tracking-wide uppercase transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.color,
                  color: "#0d1117",
                  boxShadow: `0 0 30px ${theme.color}40`,
                }}
              >
                {loading ? "Encrypting..." : "⚔️ Encrypt"}
              </button>
              <button
                onClick={handleDecrypt}
                disabled={loading}
                className="flex-1 py-3 md:py-4 rounded-xl font-cinzel font-bold text-sm sm:text-base tracking-wide uppercase border-2 transition-all duration-300 hover:shadow-lg hover:bg-white/5 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: theme.color,
                  color: theme.color,
                  boxShadow: `inset 0 0 20px ${theme.color}20`,
                }}
              >
                {loading ? "Decrypting..." : "🔓 Decrypt"}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`parchment-bg rounded-2xl p-5 md:p-8 border border-realm-border ${theme.borderClass}`}
          >
            {error && (
              <div className="flex items-center gap-2 bg-red-900/20 border border-red-800/30 rounded-lg p-3 mb-4">
                <AlertCircle className="text-red-400" size={18} />
                <span className="text-red-300 text-sm font-mono">{error}</span>
              </div>
            )}

            <div className="flex justify-between items-center mb-3">
              <label className="text-sm text-realm-muted font-cinzel uppercase tracking-wider">
                Output
              </label>
              <span
                className="px-2 py-0.5 text-xs rounded border font-cinzel"
                style={{
                  borderColor: `${theme.color}40`,
                  color: theme.color,
                  backgroundColor: `${theme.color}10`,
                }}
              >
                Result
              </span>
            </div>
            <textarea
              value={outputText}
              readOnly
              placeholder="Result will appear here"
              className="w-full h-40 sm:h-48 md:h-56 border-2 rounded-xl p-4 md:p-5 text-base md:text-lg text-realm-text font-cinzel resize-none transition-all duration-300"
              style={{
                backgroundColor: "rgba(19, 26, 38, 0.95)",
                borderColor: theme.color,
                boxShadow: `inset 0 0 20px ${theme.color}05`,
              }}
            />

            <button
              onClick={handleCopy}
              disabled={!outputText}
              className="mt-3 flex items-center gap-2 text-realm-muted hover:text-realm-text transition-colors text-sm font-mono"
            >
              <Copy size={16} />
              <span>Copy to clipboard</span>
            </button>

            <button
              onClick={handleSwap}
              disabled={!outputText}
              className="mt-2 flex items-center gap-2 text-realm-muted hover:text-realm-text transition-colors text-sm font-mono"
            >
              <Shuffle size={16} />
              <span>Swap Output to Input</span>
            </button>

            {lastResult?.explain && (
              <KeyFactorCard explain={lastResult.explain} theme={theme} />
            )}
          </motion.div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ChatbotButton isOpen={isChatOpen} onOpen={() => setIsChatOpen(true)} />
      <ChatbotWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

function ParameterFields({
  algo,
  params,
  onChange,
  theme,
  rsaKeys,
  onGenerateKeys,
}) {
  switch (algo) {
    case "rsa":
      return (
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onGenerateKeys}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-cinzel font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                backgroundColor: theme.color,
                color: "#0d1117",
                boxShadow: `0 0 20px ${theme.color}40`,
              }}
            >
              <RefreshCw size={16} />
              Generate New Keys
            </button>
          </div>

          {rsaKeys && (
            <div
              className="bg-realm-bg/80 border rounded-lg p-4 space-y-2 font-mono text-xs"
              style={{ borderColor: `${theme.color}30` }}
            >
              <div className="flex justify-between">
                <span className="text-realm-muted">Public Key (e, n):</span>
                <span className="text-realm-text">
                  ({rsaKeys.e}, {rsaKeys.n})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-realm-muted">Private Key (d, n):</span>
                <span className="text-realm-text">
                  ({rsaKeys.d}, {rsaKeys.n})
                </span>
              </div>
              <div
                className="border-t"
                style={{ borderColor: `${theme.color}20` }}
              />
              <div className="flex justify-between">
                <span className="text-realm-muted">p =</span>
                <span className="text-realm-text">{rsaKeys.p}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-realm-muted">q =</span>
                <span className="text-realm-text">{rsaKeys.q}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-realm-muted">n = p × q =</span>
                <span className="text-realm-text">{rsaKeys.n}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-realm-muted">φ(n) =</span>
                <span className="text-realm-text">{rsaKeys.phi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-realm-muted">e × d mod φ(n) =</span>
                <span className="text-realm-text">
                  {(rsaKeys.e * rsaKeys.d) % rsaKeys.phi} ≡ 1
                </span>
              </div>
            </div>
          )}
        </div>
      );

    case "vigenere":
    case "playfair":
      return (
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm text-realm-muted mb-3 font-cinzel uppercase tracking-wider">
              Key
            </label>
            <input
              type="text"
              value={params.key}
              onChange={(e) =>
                onChange({ ...params, key: e.target.value.toUpperCase() })
              }
              className="w-full bg-realm-bg border-2 rounded-lg p-4 text-base font-cinzel font-semibold text-realm-text transition-all focus:outline-none hover:shadow-md"
              style={{
                borderColor: theme.color,
                boxShadow: `inset 0 0 15px ${theme.color}10`,
              }}
            />
          </div>
          <div>
            <label className="block text-sm text-realm-muted mb-3 font-cinzel uppercase tracking-wider">
              Padding Character
            </label>
            <input
              type="text"
              value={params.padChar}
              onChange={(e) =>
                onChange({ ...params, padChar: e.target.value.toUpperCase() })
              }
              maxLength={1}
              className="w-16 bg-realm-bg border-2 rounded-lg p-2 text-center font-cinzel font-bold text-realm-text uppercase transition-all hover:shadow-md"
              style={{
                borderColor: theme.color,
                boxShadow: `inset 0 0 12px ${theme.color}10`,
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={params.stripPadding}
              onChange={(e) =>
                onChange({ ...params, stripPadding: e.target.checked })
              }
              className="accent-inherit"
              style={{ accentColor: theme.color }}
            />
            <span className="text-sm text-realm-muted font-mono">
              Strip trailing padding
            </span>
          </div>
        </div>
      );

    case "hill":
      return (
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm text-realm-muted mb-3 font-cinzel uppercase tracking-wider">
              Key Matrix (2×2)
            </label>
            <div className="grid grid-cols-2 gap-2 w-48">
              {params.matrix?.flat().map((val, i) => (
                <NumberInput
                  key={i}
                  value={val}
                  onChange={(newVal) => {
                    const newMatrix = [...params.matrix];
                    newMatrix[Math.floor(i / 2)][i % 2] = newVal;
                    onChange({ ...params, matrix: newMatrix });
                  }}
                  min={0}
                  max={25}
                  theme={theme}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-realm-muted mb-3 font-cinzel uppercase tracking-wider">
              Padding Character
            </label>
            <input
              type="text"
              value={params.padChar}
              onChange={(e) =>
                onChange({ ...params, padChar: e.target.value.toUpperCase() })
              }
              maxLength={1}
              className="w-20 bg-realm-bg border-2 rounded-lg p-3 text-base text-center font-cinzel font-bold text-realm-text uppercase transition-all hover:shadow-md"
              style={{
                borderColor: theme.color,
                boxShadow: `inset 0 0 12px ${theme.color}10`,
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={params.stripPadding}
              onChange={(e) =>
                onChange({ ...params, stripPadding: e.target.checked })
              }
              style={{ accentColor: theme.color }}
            />
            <span className="text-sm text-realm-muted font-mono">
              Strip trailing padding
            </span>
          </div>
        </div>
      );

    default:
      return null;
  }
}
