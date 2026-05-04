const express = require('express');
const path = require('path');
const hillRoutes = require('./routes/hill');
const caesarRoutes = require('./routes/caesar');
const playfairRoutes = require('./routes/playfair');
const vigenereRoutes = require('./routes/vigenere');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 8080;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const clientPath = path.join(__dirname, '..', '..', 'client');
app.use(express.static(clientPath));

app.use('/api/health', healthRoutes);
app.use('/api/hill', hillRoutes);
app.use('/api/caesar', caesarRoutes);
app.use('/api/playfair', playfairRoutes);
app.use('/api/vigenere', vigenereRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} *`);
});

module.exports = app;