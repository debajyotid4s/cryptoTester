const express = require("express");
const { encrypt, decrypt } = require("../algos/hill2x2");
const {
  requireString,
  require2x2Matrix,
  requirePadCharAZ,
} = require("../utils/validate");

const router = express.Router();

function errorResponse(res, err) {
  const status = err.message?.includes("not invertible") ? 400 : 400;
  res.status(status).json({
    error: err.message,
    details: {
      code: "HILL_CIPHER_ERROR",
      timestamp: new Date().toISOString(),
    },
  });
}

router.post("/encrypt", (req, res) => {
  try {
    const text = requireString(req.body.text, "text");
    const matrix = require2x2Matrix(req.body.params?.matrix, "matrix");
    const padChar = requirePadCharAZ(req.body.params?.padChar);

    const result = encrypt(text, matrix, { padChar, m: 26 });

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
    const matrix = require2x2Matrix(req.body.params?.matrix, "matrix");
    const padChar = requirePadCharAZ(req.body.params?.padChar);
    const stripPadding =
      req.body.params?.stripPadding !== undefined
        ? req.body.params.stripPadding
        : false;
    const padAdded = req.body.params?.padAdded || 0;

    const result = decrypt(text, matrix, {
      padChar,
      m: 26,
      stripPadding,
      padAdded,
    });

    return res.json({
      result: result.result,
      explain: result.explain,
    });
  } catch (err) {
    return errorResponse(res, err);
  }
});

module.exports = router;
