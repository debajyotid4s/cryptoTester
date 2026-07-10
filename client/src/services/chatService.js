import { apiPostRaw } from "./http";

export async function sendMessage({
  messages,
  algorithmContext = null,
  onChunk,
  onDone,
  onError,
}) {
  let response;

  try {
    response = await apiPostRaw("/api/chat", { messages, algorithmContext });
  } catch {
    onError("Cannot connect to server. Is the backend running?");
    return;
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    onError(err.error || `Server error: ${response.status}`);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);

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
          } catch {
            // skip unparseable chunks
          }
        }
      }
    }

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
        } catch {
          // skip
        }
      }
    }

    onDone();
  } catch (error) {
    onError(error.message || "Stream error");
  }
}
