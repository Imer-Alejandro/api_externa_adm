function requestLogger(req, res, next) {
  const startTime = process.hrtime();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const elapsed = process.hrtime(startTime);
    const elapsedMs = Math.round(elapsed[0] * 1000 + elapsed[1] / 1e6);
    console.log(`${new Date().toISOString()} ${method} ${originalUrl} ${res.statusCode} - ${elapsedMs}ms`);
  });

  next();
}

module.exports = requestLogger;
