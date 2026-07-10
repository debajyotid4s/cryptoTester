const express = require("express");

const router = express.Router();

const MODELS = [
  "gemini-2.5-flash",
  "gemini-1.5-flash",
];

const DEFAULT_SYSTEM_PROMPT = `You are a knowledgeable cryptography assistant in a fantasy realm called "Cryptographic Realm". You help users understand classical ciphers.

Available ciphers:
- Caesar Cipher (Iron Dominion): A shift cipher where each letter is shifted by a fixed number.
- Vigenère Cipher (Emerald Archives): A polyalphabetic cipher using a keyword to generate a key stream.
- Playfair Cipher (Frost Citadel): A digraph cipher using a 5x5 key matrix.
- Hill 2×2 Cipher (Golden Kingdom): A matrix cipher using 2x2 block encryption.

When answering, be educational and use examples. Keep responses concise.`;

function isRateLimitError(status, body) {
  if (status === 429) return true;
  if (body && /rate|limit|RPD|RPM|quota|resource.*exhausted|too many/i.test(body)) return true;
  return false;
}

async function tryModel(model, body, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    return { error: { status: response.status, body: errText }, response: null };
  }

  return { error: null, response };
}

function streamResponse(response, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new Promise((resolve) => {
    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop();

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (!data) continue;
              if (data === "[DONE]") {
                res.write("data: [DONE]\n\n");
              } else {
                try {
                  const parsed = JSON.parse(data);
                  const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
                  if (text) {
                    const chunk = JSON.stringify({
                      choices: [{ delta: { content: text } }],
                    });
                    res.write(`data: ${chunk}\n\n`);
                  }
                } catch {
                  res.write(`data: ${data}\n\n`);
                }
              }
            }
          }
        }

        if (buffer.startsWith("data: ")) {
          const data = buffer.slice(6).trim();
          if (data && data !== "[DONE]") {
            try {
              const parsed = JSON.parse(data);
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (text) {
                const chunk = JSON.stringify({
                  choices: [{ delta: { content: text } }],
                });
                res.write(`data: ${chunk}\n\n`);
              }
            } catch {
              res.write(`data: ${data}\n\n`);
            }
          }
        }

        res.write("data: [DONE]\n\n");
        res.end();
      } catch (err) {
        res.write(`data: {"error": "${err.message}"}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
      }
      resolve();
    })();
  });
}

router.post("/", async (req, res) => {
  try {
    const { messages, algorithmContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OPENROUTER_API_KEY not configured on server" });
    }

    const systemMessage = {
      role: "user",
      parts: [{ text: algorithmContext
        ? `${DEFAULT_SYSTEM_PROMPT}\n\nThe user is currently in the ${algorithmContext.kingdom} (${algorithmContext.cipher}). Tailor your responses to this cipher.`
        : DEFAULT_SYSTEM_PROMPT
      }],
    };

    const geminiContents = [systemMessage];
    for (const msg of messages) {
      if (msg.role === "assistant" || msg.role === "user") {
        geminiContents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
    }

    const body = JSON.stringify({ contents: geminiContents });

    let lastError = null;

    for (const model of MODELS) {
      const { error, response } = await tryModel(model, body, apiKey);

      if (error) {
        lastError = error;
        if (isRateLimitError(error.status, error.body)) {
          continue;
        }
        return res.status(502).json({
          error: `Gemini API error (${model}): ${error.status}`,
          details: error.body,
        });
      }

      return await streamResponse(response, res);
    }

    return res.status(429).json({
      error: "All models are rate-limited. Please try again later.",
      details: lastError ? lastError.body : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
