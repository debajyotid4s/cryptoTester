require("dotenv").config();

const express = require("express");
const path = require("path");
const hillRoutes = require("./routes/hill");
const caesarRoutes = require("./routes/caesar");
const playfairRoutes = require("./routes/playfair");
const vigenereRoutes = require("./routes/vigenere");
const healthRoutes = require("./routes/health");
const chatRoutes = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API routes MUST come before static files
app.use("/api/health", healthRoutes);
app.use("/api/hill", hillRoutes);
app.use("/api/caesar", caesarRoutes);
app.use("/api/playfair", playfairRoutes);
app.use("/api/vigenere", vigenereRoutes);
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

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} *`);
});

module.exports = app;
