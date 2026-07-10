export const CIPHER_ALGORITHMS = {
  rsa: {
    id: "rsa",
    name: "Iron Sanctum",
    realm: "RSA Cipher",
    description:
      "The mathematical stronghold of asymmetric encryption, fortified by prime numbers",
    theme: "iron",
    color: "#dc2626",
    accentColor: "#ef4444",
    borderColor: "#991b1b",
    invented: "1977",
    securityLevel: "High",
  },
  vigenere: {
    id: "vigenere",
    name: "Emerald Archives",
    realm: "Vigenère Cipher",
    description:
      "Secrets of the scholarly councils, encrypted within an endless emerald key",
    theme: "emerald",
    color: "#10b981",
    accentColor: "#34d399",
    borderColor: "#047857",
    invented: "1553",
    securityLevel: "Medium",
  },
  playfair: {
    id: "playfair",
    name: "Frost Citadel",
    realm: "Playfair Cipher",
    description:
      "Fortress of digraph encryption, crafted in the frozen northern halls",
    theme: "frost",
    color: "#3b82f6",
    accentColor: "#60a5fa",
    borderColor: "#1d4ed8",
    invented: "1854",
    securityLevel: "Medium",
  },
  hill: {
    id: "hill",
    name: "Golden Kingdom",
    realm: "Hill Cipher",
    description:
      "The mathematical empire, where matrix operations rule the realm",
    theme: "gold",
    color: "#f59e0b",
    accentColor: "#fbbf24",
    borderColor: "#b45309",
    invented: "1929",
    securityLevel: "Medium-High",
  },
};

const API_URL = import.meta.env.VITE_API_URL || "";

export async function encrypt(algo, text, params) {
  const response = await fetch(`${API_URL}/api/${algo}/encrypt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, params }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Encryption failed");
  return data;
}

export async function decrypt(algo, text, params) {
  const response = await fetch(`${API_URL}/api/${algo}/decrypt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, params }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Decryption failed");
  return data;
}

export async function generateKeys(algo, params = {}) {
  const response = await fetch(`${API_URL}/api/${algo}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Key generation failed");
  return data;
}
