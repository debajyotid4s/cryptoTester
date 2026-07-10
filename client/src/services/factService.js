const API_URL = import.meta.env.VITE_API_URL || "";

export async function fetchAlgorithmFact(kingdom, cipher) {
  const response = await fetch(`${API_URL}/api/chat/fact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kingdom, cipher }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to fetch fact");
  return data.fact;
}
