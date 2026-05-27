const express = require("express");
const { encrypt, decrypt } = require("../algos/vigenere");
const { requireString } = require("../utils/validate");

const router = express.Router();

function errorResponse(res, err) {
  res.status(400).json({
    error: err.message,
    details: {
      code: "VIGENERE_CIPHER_ERROR",
      timestamp: new Date().toISOString(),
    },
  });
}

function requireKey(x, fieldName) {
  if (x === undefined || x === null || x === "") {
    return "KEY";
  }
  if (typeof x !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }
  const sanitized = x.toUpperCase().replace(/[^A-Z]/g, "");
  if (sanitized.length === 0) {
    throw new Error(`${fieldName} must contain at least one letter`);
  }
  return sanitized;
}

router.post("/encrypt", (req, res) => {
  try {
    const text = requireString(req.body.text, "text");
    const key = requireKey(req.body.params?.key, "key");

    const result = encrypt(text, { key });

    return res.json({
      result: result.result,
      explain: result.explain,
    });
  } catch (err) {
    return errorResponse(res, err);
  }
});

router.post("/decrypt", (req, res) => {
  try {
    const text = requireString(req.body.text, "text");
    const key = requireKey(req.body.params?.key, "key");

    const result = decrypt(text, { key });

    return res.json({
      result: result.result,
      explain: result.explain,
    });
  } catch (err) {
    return errorResponse(res, err);
  }
});

module.exports = router;
