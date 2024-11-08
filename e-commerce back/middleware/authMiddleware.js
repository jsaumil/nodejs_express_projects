const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const authMiddleware = catchAsync(async (req,res,next) => {
    let token;
    if(req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log(decoded);
                
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
        }
    } else {
        return next(new AppError('No token provided', 401));
    }
});

module.exports = authMiddleware;