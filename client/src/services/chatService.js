const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Send a chat message and stream the response.
 *
 * @param {Object}   options
 * @param {Array}    options.messages           - Full conversation history [{role, content}]
 * @param {Object}   options.algorithmContext   - { kingdom, cipher } | null
 * @param {Function} options.onChunk            - Called with each new token string
 * @param {Function} options.onDone             - Called when stream completes
 * @param {Function} options.onError            - Called with error message string
 */
export async function sendMessage({
  messages,
  algorithmContext = null,
  onChunk,
  onDone,
  onError,
}) {
  let response;

  try {
    response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, algorithmContext }),
    });
  } catch {
    onError("Cannot connect to server. Is the backend running?");
    return;
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    onError(err.error || `Server error: ${response.status}`);
    return;
  }

  // ── Read SSE stream ──────────────────────────────────────────────────────────
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6); // Remove "data: " prefix

          if (data === "[DONE]") {
            onDone();
            return;
          }

          try {
            const chunk = JSON.parse(data);
            const token = chunk.choices?.[0]?.delta?.content || "";
            if (token) {
              onChunk(token);
            }
          } catch (e) {
            console.error("Failed to parse chunk:", e);
          }
        }
      }
    }

    // Process any remaining buffer
    if (buffer.startsWith("data: ")) {
      const data = buffer.slice(6);
      if (data === "[DONE]") {
        onDone();
      } else {
        try {
          const chunk = JSON.parse(data);
          const token = chunk.choices?.[0]?.delta?.content || "";
          if (token) {
            onChunk(token);
          }
        } catch (e) {
          console.error("Failed to parse final chunk:", e);
        }
      }
    }

    onDone();
  } catch (error) {
    onError(error.message || "Stream error");
  }
}
