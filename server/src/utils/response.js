function errorResponse(res, err, code = "CIPHER_ERROR") {
  res.status(400).json({
    error: err.message,
    details: {
      code,
      timestamp: new Date().toISOString(),
    },
  });
}

module.exports = { errorResponse };
