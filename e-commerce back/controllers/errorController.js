const AppError = require('./../utils/appError');

const sendError = (err,res) => {
    console.log(err);
    
    res.status(err.statusCode).json({
        status: err.status || 'error',
        error: err,
        message: err.message,
        stack: err.stack
    });
};

module.exports = (err,req,res,next) => {
    err.statusCode = err.status || 500;
    err.status = err.status || 'error';

    sendError(err, res);
}