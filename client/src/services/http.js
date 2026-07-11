const DEFAULT_API_URL = "https://crypto-tester-zeta.vercel.app";
const isLocalHost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

const API_URL = (import.meta.env.VITE_API_URL || (isLocalHost ? "" : DEFAULT_API_URL)).replace(/\/$/, "");
const AUTH_KEY = import.meta.env.VITE_API_AUTH_KEY || "";

function authHeaders() {
  return AUTH_KEY ? { Authorization: `Bearer ${AUTH_KEY}` } : {};
}

export async function apiPost(path, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

export async function apiPostRaw(path, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  return response;
}
