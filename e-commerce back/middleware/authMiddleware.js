const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.authMiddleware = catchAsync(async (req,res,next) => {
    // let token;
    // if(req.headers.authorization.startsWith('Bearer')){
    //     token = req.headers.authorization.split(' ')[1];

    //     if (token) {
    //         try {
    //             const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //             console.log(decoded);
                
    //             // Find user based on the decoded token's ID
    //             const currentUser = await User.findById(decoded.id);
                
    //             if (!currentUser) {
    //                 return next(new AppError('User belonging to this token does not exist', 401));
    //             }
                
    //             req.user = currentUser; // Attach user data to the request object
    //             next();
    //         } catch (error) {
    //             return next(new AppError('Token is invalid or expired. Please log in again.', 401));
    //         }
    //     }
    // } else {
    //     return next(new AppError('No token provided', 401));
    // }

    let token;

    // Check if the authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else {
        return next(new AppError('No token provided', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user based on the decoded token's ID
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError('User belonging to this token does not exist', 401));
        }

        req.user = currentUser; // Attach user data to the request object
        next();
    } catch (error) {
        return next(new AppError('Token is invalid or expired. Please log in again.', 401));
    }
});

exports.isAdmin = async (req, res, next) => {
    if (!req.user) {
        return next(new AppError('You need to be logged in to access this route', 401));
    }
    
    if (req.user.role !== "admin") {
        return next(new AppError('You are not an admin', 403));
    }
    
    next();
};