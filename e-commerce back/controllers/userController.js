const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


exports.createUser = catchAsync(async (req, res, next) =>{
    // console.log("Request body:", req.body);
    const { firstname, lastname, email, mobile, password } = req.body;

    if (!firstname || !lastname || !email || !mobile || !password) {
        return next(new AppError('All fields are required', 400));  // Use a valid status code (e.g., 400)
    }

    const newUser = await User.create({ firstname, lastname, email, mobile, password });
    
    res.status(201).json({
        message: 'User created successfully',
        data: {
            user: newUser
        }
    });
});

exports.loginUser = catchAsync(async (req,res,next) => {
    const {email,password} = req.body;

    const findUser = await User.findOne({email});
    if(!findUser){
        return next(new AppError('User not found',404));
    }
    const isMatch = await findUser.isPasswordMatch(password);
    if(!isMatch){
        return next(new AppError('Incorrect password',401));
    }

    res.status(201).json({
        message: 'Logged in successfully',
        data: {
            user: findUser
        }
    });
});