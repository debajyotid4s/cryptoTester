const express = require("express");
const { encrypt, decrypt } = require("../algos/vigenere");
const { requireString, requireKey } = require("../utils/validate");
const { errorResponse } = require("../utils/response");

const router = express.Router();

router.post("/encrypt", (req, res) => {
  try {
    const text = requireString(req.body.text, "text");
    const key = requireKey(req.body.params?.key, "key", "KEY");

    const result = encrypt(text, { key });

    return res.json({
      result: result.result,
      explain: result.explain,
    });
  } catch (err) {
    return errorResponse(res, err, "VIGENERE_CIPHER_ERROR");
  }
});

router.post("/decrypt", (req, res) => {
  try {
    const text = requireString(req.body.text, "text");
    const key = requireKey(req.body.params?.key, "key", "KEY");

    const result = decrypt(text, { key });

    return res.json({
      result: result.result,
      explain: result.explain,
    });
  } catch (err) {
    return errorResponse(res, err, "VIGENERE_CIPHER_ERROR");
  }
});

module.exports = router;