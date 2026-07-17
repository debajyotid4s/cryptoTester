import { apiPost } from "./http";

const FALLBACK_FACTS = {
  "Iron Sanctum|RSA Cipher":
    "RSA, introduced by Rivest, Shamir, and Adleman in 1977, protects messages with a pair of linked keys built from large prime numbers. Its strength comes from the difficulty of factoring the modulus, which made public-key encryption practical for the first time.",
  "Emerald Archives|Vigenère Cipher":
    "The Vigenère cipher dates back to the 16th century and became famous as a polyalphabetic cipher that shifts each letter using a repeated keyword. It resisted simple frequency analysis far better than earlier substitution ciphers, which made it a major step forward in classical cryptography.",
  "Frost Citadel|Playfair Cipher":
    "The Playfair cipher, developed by Charles Wheatstone and popularized by Lord Playfair in the 1850s, encrypts pairs of letters instead of single characters. That digraph approach made it much harder to attack with basic frequency counting and helped shape later block-cipher ideas.",
  "Golden Kingdom|Hill Cipher":
    "The Hill cipher, introduced by Lester S. Hill in 1929, uses matrix multiplication over modular arithmetic to scramble letter blocks. It was notable because it turned encryption into linear algebra, showing how mathematics could drive modern cipher design.",
};

export function getLocalAlgorithmFact(kingdom, cipher) {
  return FALLBACK_FACTS[`${kingdom}|${cipher}`] || "";
}

export async function fetchAlgorithmFact(kingdom, cipher) {
  try {
    const data = await apiPost("/api/chat/fact", { kingdom, cipher });
    return data.fact || getLocalAlgorithmFact(kingdom, cipher);
  } catch {
    return getLocalAlgorithmFact(kingdom, cipher);
  }
}
