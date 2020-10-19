const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 404);
};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue);
  const message = `Duplicate field value: ${value}. Please use other value!`;
  return new AppError(message, 404);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 404);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired, please log in again!', 401);

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    //RENDERED WEBSITE
    console.error('ERROR', err);
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error('ERROR', err);

    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  if (err.isOperational) {
    //RENDERED WEBSITE
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  console.error('ERROR', err);

  //RENDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }; // o puedo hacer Object.create(err)
    error.message = err.message;
    //ERRORES DE LIBRARIES:
    //Validation Mongoose:
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err._message === 'Validation failed')
      error = handleValidationErrorDB(error);
    //JWT:
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
