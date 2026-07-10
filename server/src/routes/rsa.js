const express = require("express");
const { generateKeys, encrypt, decrypt } = require("../algos/rsa");
const { requireString } = require("../utils/validate");
const { errorResponse } = require("../utils/response");

const router = express.Router();

router.post("/generate", (req, res) => {
  try {
    const p = req.body.p || undefined;
    const q = req.body.q || undefined;
    const e = req.body.e || undefined;
    const keys = generateKeys({ p, q, e });

    return res.json({ keys });
  } catch (err) {
    return errorResponse(res, err, "RSA_KEYGEN_ERROR");
  }
});

router.post("/encrypt", (req, res) => {
  try {
    const text = requireString(req.body.text, "text");
    const { e, n } = req.body.params || {};
    if (!e || !n) throw new Error("Public key (e, n) is required");

    const result = encrypt(text, { e, n, p: req.body.params.p, q: req.body.params.q, phi: req.body.params.phi });

    return res.json({
      result: result.result,
      explain: result.explain,
    });
  } catch (err) {
    return errorResponse(res, err, "RSA_ENCRYPT_ERROR");
  }
});

router.post("/decrypt", (req, res) => {
  try {
    const text = requireString(req.body.text, "text");
    const { d, n } = req.body.params || {};
    if (!d || !n) throw new Error("Private key (d, n) is required");

    const result = decrypt(text, { d, n, p: req.body.params.p, q: req.body.params.q, phi: req.body.params.phi });

    return res.json({
      result: result.result,
      explain: result.explain,
    });
  } catch (err) {
    return errorResponse(res, err, "RSA_DECRYPT_ERROR");
  }
});

module.exports = router;
