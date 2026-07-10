import { apiPost } from "./http";

export async function fetchAlgorithmFact(kingdom, cipher) {
  const data = await apiPost("/api/chat/fact", { kingdom, cipher });
  return data.fact;
}
