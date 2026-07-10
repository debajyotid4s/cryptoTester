function errorResponse(res, err) {
  res.status(400).json({
    error: err.message,
  });
}

module.exports = { errorResponse };