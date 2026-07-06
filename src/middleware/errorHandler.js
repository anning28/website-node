function notFound(req, res, next) {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Request validation failed';
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'Email is already registered';
  }

  if (statusCode >= 500 && process.env.NODE_ENV !== 'test') {
    console.error(error);
  }

  res.status(statusCode).json({ message });
}

module.exports = {
  errorHandler,
  notFound
};
