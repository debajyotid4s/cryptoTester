const express = require("express");
const { encrypt, decrypt } = require("../algos/hill2x2");
const {
  requireString,
  require2x2Matrix,
  requirePadCharAZ,
} = require("../utils/validate");
const { errorResponse } = require("../utils/response");

const router = express.Router();

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
    return errorResponse(res, err, "HILL_CIPHER_ERROR");
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
    const padAddedPerWord = req.body.params?.padAddedPerWord;

    const result = decrypt(text, matrix, {
      padChar,
      m: 26,
      stripPadding,
      padAdded,
      padAddedPerWord,
    });

    return res.json({
      result: result.result,
      explain: result.explain,
    });
  } catch (err) {
    return errorResponse(res, err, "HILL_CIPHER_ERROR");
  }
});

module.exports = router;
