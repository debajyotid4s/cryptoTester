const express = require("express");
const { generateKeys, encrypt, decrypt } = require("../algos/rsa");
const { requireString, requirePositiveInt, requireOptionalPositiveInt } = require("../utils/validate");
const { errorResponse } = require("../utils/response");

const router = express.Router();

router.post("/generate", (req, res) => {
  try {
    const p = requireOptionalPositiveInt(req.body.p, "p");
    const q = requireOptionalPositiveInt(req.body.q, "q");
    const e = requireOptionalPositiveInt(req.body.e, "e");
    const keys = generateKeys({ p, q, e });

    return res.json({ keys });
  } catch (err) {
    return errorResponse(res, err, "RSA_KEYGEN_ERROR");
  }
});

router.post("/encrypt", (req, res) => {
  try {
    const text = requireString(req.body.text, "text");
    const params = req.body.params || {};
    const e = requirePositiveInt(params.e, "e");
    const n = requirePositiveInt(params.n, "n");
    const p = requireOptionalPositiveInt(params.p, "p");
    const q = requireOptionalPositiveInt(params.q, "q");
    const phi = requireOptionalPositiveInt(params.phi, "phi");

    const result = encrypt(text, { e, n, p, q, phi });

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
    const params = req.body.params || {};
    const d = requirePositiveInt(params.d, "d");
    const n = requirePositiveInt(params.n, "n");
    const p = requireOptionalPositiveInt(params.p, "p");
    const q = requireOptionalPositiveInt(params.q, "q");
    const phi = requireOptionalPositiveInt(params.phi, "phi");

    const result = decrypt(text, { d, n, p, q, phi });

    return res.json({
      result: result.result,
      explain: result.explain,
    });
  } catch (err) {
    return errorResponse(res, err, "RSA_DECRYPT_ERROR");
  }
});

module.exports = router;