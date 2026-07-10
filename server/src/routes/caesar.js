const express = require("express");
const { encrypt, decrypt } = require("../algos/caesar");
const { requireString } = require("../utils/validate");
const { errorResponse } = require("../utils/response");

const router = express.Router();

function requireShift(x, fieldName) {
  if (x === undefined || x === null) {
    return 3;
  }
  if (typeof x !== "number" || !Number.isInteger(x)) {
    throw new Error(`${fieldName} must be an integer`);
  }
  return x;
}

router.post("/encrypt", (req, res) => {
  try {
    const text = requireString(req.body.text, "text");
    const shift = requireShift(req.body.params?.shift, "shift");

    const result = encrypt(text, { shift, m: 26 });

    return res.json({
      result: result.result,
      explain: result.explain,
    });
  } catch (err) {
    return errorResponse(res, err, "CAESAR_CIPHER_ERROR");
  }
});

router.post("/decrypt", (req, res) => {
  try {
    const text = requireString(req.body.text, "text");
    const shift = requireShift(req.body.params?.shift, "shift");

    const result = decrypt(text, { shift, m: 26 });

    return res.json({
      result: result.result,
      explain: result.explain,
    });
  } catch (err) {
    return errorResponse(res, err, "CAESAR_CIPHER_ERROR");
  }
});

module.exports = router;
