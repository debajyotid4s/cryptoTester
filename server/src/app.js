require("dotenv").config();

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hillRoutes = require("./routes/hill");
const playfairRoutes = require("./routes/playfair");
const vigenereRoutes = require("./routes/vigenere");
const healthRoutes = require("./routes/health");
const rsaRoutes = require("./routes/rsa");
const chatRoutes = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 3001;
const API_AUTH_KEY = process.env.API_AUTH_KEY || "";

// Security headers
app.use(helmet());

// CORS — whitelist known origins
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3001",
  "https://debajyotid4s.github.io",
  "https://crypto-tester-zeta.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Auth middleware — all /api/* except health require Bearer token
app.use("/api", (req, res, next) => {
  if (req.path === "/health") return next();
  if (!API_AUTH_KEY) return next();
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ") || auth.slice(7) !== API_AUTH_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// Body size limit
app.use(express.json({ limit: "100kb" }));

// Rate limiting
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", globalLimiter);
app.use("/api/chat", chatLimiter);

// API routes MUST come before static files
app.use("/api/health", healthRoutes);
app.use("/api/hill", hillRoutes);
app.use("/api/playfair", playfairRoutes);
app.use("/api/vigenere", vigenereRoutes);
app.use("/api/rsa", rsaRoutes);
app.use("/api/chat", chatRoutes);

// Static file serving for production build (if exists)
const fs = require("fs");
const clientDistPath = path.join(__dirname, "..", "..", "client", "dist");
const distExists = fs.existsSync(clientDistPath);

if (distExists) {
  app.use(express.static(clientDistPath));

  // Fallback for SPA routing - using regex instead of wildcard
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
      if (err) {
        res.status(404).json({ error: "Not found" });
      }
    });
  });
}

// Error handler — never leak stack traces
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
