const AppError = require('./../utils/appError')

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message,400)
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message,400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message,400);
};

const sendErrorDev = (err,res) =>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack : err.stack
    });
    // res.send(err);
    // console.log(err);
}

const sendErrorProd = (err,res) => {
    //Operational, trust error: send message to client
    if(err.isOperational){
        res.status(err.statusCode).json({
        status: err.status,
        message: err.message
        });
    }
    
    //Programming or other unknow error: don't leak error details
    else{
        //1)Log error
        console.error('ERROR',err); 

        //2)send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
}

module.exports = (err,req,res,next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res);
    }else if (process.env.NODE_ENV === 'production'){
        let error = {...err};

        if(err.name === 'CastError') error = handleCastErrorDB(err);
        if (err.code === 11000) error = handleDuplicateFieldsDB(err);
        if(err.name === 'ValidationError') error = handleValidationErrorDB(err);
        
        sendErrorProd(error,res);
    }
};