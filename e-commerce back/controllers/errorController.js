const AppError = require('./../utils/appError');

const sendError = (err, res) => {
    // Ensure err.statusCode is a valid HTTP status code, defaulting to 500 if undefined
    console.log(err);
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: err.status || 'error', // Use 'error' if 'status' is undefined
        error: err,
        message: err.message,
        stack: err.stack
    });
};

module.exports = (err, req, res, next) => {
    // Ensure err.statusCode is set to a number, defaulting to 500 if undefined
    err.statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
    err.status = err.status || 'error';

    sendError(err, res);
};