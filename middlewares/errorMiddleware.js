const ErrorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Enternal server error";
  err.statusCode = err.statusCode || 500;

  // for duplicate key in mongodb
  // if you dont want to use class for error
  // if (err.code === 11000) {
  //   err.message = "duplicate key error";
  //   err.statusCode = "400";
  // }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorMiddleware;
