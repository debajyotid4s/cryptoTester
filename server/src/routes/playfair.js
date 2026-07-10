const express = require("express");
const { encrypt, decrypt } = require("../algos/playfair");
const { requireString } = require("../utils/validate");
const { errorResponse } = require("../utils/response");

const router = express.Router();

function requireKey(x, fieldName) {
  if (x === undefined || x === null || x === "") {
    return "CIPHER";
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
    return errorResponse(res, err, "PLAYFAIR_CIPHER_ERROR");
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
    return errorResponse(res, err, "PLAYFAIR_CIPHER_ERROR");
  }
});

module.exports = router;
