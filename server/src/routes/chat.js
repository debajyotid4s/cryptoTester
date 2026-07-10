const express = require("express");
const { requireString } = require("../utils/validate");

const router = express.Router();

const MODELS = [
  "gemini-2.5-flash",
  "gemini-3.5-flash",
];

const MAX_MESSAGES = 20;
const RETRY_DELAY_MS = 1000;

const factCache = new Map();
const FACT_CACHE_TTL = 60 * 60 * 1000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const DEFAULT_SYSTEM_PROMPT = `You are a knowledgeable cryptography assistant in a fantasy realm called "Cryptographic Realm". You help users understand classical ciphers.

Available ciphers:
- RSA Cipher (Iron Sanctum): An asymmetric cipher using prime numbers and modular arithmetic.
- Vigenère Cipher (Emerald Archives): A polyalphabetic cipher using a keyword to generate a key stream.
- Playfair Cipher (Frost Citadel): A digraph cipher using a 5x5 key matrix.
- Hill 2×2 Cipher (Golden Kingdom): A matrix cipher using 2x2 block encryption.

When answering, be educational and use examples. Keep responses concise.`;

function isRetryableError(status, body) {
  if (status === 429) return true;
  if (status === 404) return true;
  if (body && /rate|limit|quota|exhausted|too many|no longer available/i.test(body)) return true;
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
                  // skip unparseable chunks
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
              // skip
            }
          }
        }

        res.write("data: [DONE]\n\n");
        res.end();
      } catch (err) {
        res.write(`data: {"error": "Stream error"}\n\n`);
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

    if (messages.length > MAX_MESSAGES) {
      return res.status(400).json({ error: `Too many messages (max ${MAX_MESSAGES})` });
    }

    for (const msg of messages) {
      if (!msg.role || typeof msg.content !== "string" || msg.content.length > 500) {
        return res.status(400).json({ error: "Invalid message format" });
      }
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Chat service not configured" });
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

    for (const [i, model] of MODELS.entries()) {
      if (i > 0) await sleep(RETRY_DELAY_MS);

      const { error, response } = await tryModel(model, body, apiKey);

      if (error) {
        lastError = error;
        console.error(`[chat] model=${model} status=${error.status} body=${error.body?.slice(0, 200)}`);
        if (isRetryableError(error.status, error.body)) {
          continue;
        }
        return res.status(502).json({ error: "AI service temporarily unavailable" });
      }

      return await streamResponse(response, res);
    }

    console.error(`[chat] all models exhausted: ${JSON.stringify(lastError)}`);
    return res.status(503).json({
      error: "AI service unavailable. Please try again later.",
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

async function tryModelNonStreaming(model, body, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    return { error: { status: response.status, body: errText }, data: null };
  }

  const data = await response.json();
  return { error: null, data };
}

router.post("/fact", async (req, res) => {
  try {
    const { kingdom, cipher } = req.body;
    if (!kingdom || typeof kingdom !== "string" || kingdom.length > 100) {
      return res.status(400).json({ error: "Invalid kingdom" });
    }
    if (!cipher || typeof cipher !== "string" || cipher.length > 100) {
      return res.status(400).json({ error: "Invalid cipher" });
    }

    const cacheKey = `${kingdom}:${cipher}`;
    const cached = factCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < FACT_CACHE_TTL) {
      return res.json({ fact: cached.text });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Chat service not configured" });
    }

    const factPrompt = `You are a knowledgeable cryptography assistant in a fantasy realm called "Cryptographic Realm".
The user has just entered the **${kingdom}** — home of the **${cipher}**.

Give a brief, engaging educational fact about the ${cipher}.
Include historical context (who invented it and when), how it works at a high level, and why it was significant.
Keep it to 2-3 short paragraphs. Be concise but educational. Write in a voice that suits a fantasy realm.`;

    const geminiContents = [
      {
        role: "user",
        parts: [{ text: factPrompt }],
      },
    ];

    const body = JSON.stringify({ contents: geminiContents });

    let lastError = null;

    for (const [i, model] of MODELS.entries()) {
      if (i > 0) await sleep(RETRY_DELAY_MS);

      const { error, data } = await tryModelNonStreaming(model, body, apiKey);

      if (error) {
        lastError = error;
        console.error(`[fact] model=${model} status=${error.status} body=${error.body?.slice(0, 200)}`);
        if (isRetryableError(error.status, error.body)) {
          continue;
        }
        return res.status(502).json({ error: "AI service temporarily unavailable" });
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      factCache.set(cacheKey, { text, timestamp: Date.now() });
      return res.json({ fact: text });
    }

    console.error(`[fact] all models exhausted: ${JSON.stringify(lastError)}`);
    return res.status(429).json({
      error: "AI service is rate-limited. Please try again later.",
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;