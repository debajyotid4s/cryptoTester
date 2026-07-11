const DEFAULT_API_URL = "https://crypto-tester-zeta.vercel.app";
const isLocalHost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

const API_URL = (
  import.meta.env.VITE_API_URL || (isLocalHost ? "" : DEFAULT_API_URL)
).replace(/\/$/, "");
const AUTH_KEY = import.meta.env.VITE_API_AUTH_KEY || "";

function normalizeBaseUrl(baseUrl) {
  return baseUrl ? baseUrl.replace(/\/$/, "") : "";
}

function buildApiUrl(baseUrl, path) {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  return `${normalizedBase}${path}`;
}

function shouldRetryWithFallback(response, primaryUrl, fallbackUrl) {
  if (!fallbackUrl || primaryUrl === fallbackUrl) return false;
  return response.status === 404 || response.status === 405;
}

async function postWithFallback(path, body) {
  const fallbackBase = isLocalHost ? DEFAULT_API_URL : DEFAULT_API_URL;
  const primaryUrl = buildApiUrl(API_URL, path);
  const fallbackUrl = buildApiUrl(fallbackBase, path);

  let response = await fetch(primaryUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });

  if (shouldRetryWithFallback(response, primaryUrl, fallbackUrl)) {
    response = await fetch(fallbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    });
  }

  return response;
}

function authHeaders() {
  return AUTH_KEY ? { Authorization: `Bearer ${AUTH_KEY}` } : {};
}

export async function apiPost(path, body) {
  const response = await postWithFallback(path, body);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

export async function apiPostRaw(path, body) {
  return await postWithFallback(path, body);
}
