const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const generateToken = require("./../config/jwtToken");
const mongoose = require('mongoose');
const generateRefreshToken = require("./../config/refreshToken");
const jwt=require('jsonwebtoken');

const validateObjectId = (id, next) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError('Invalid ID format', 400));
    }
};


//Create a User
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


//Login a User
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
    
    const refreshToken = await generateRefreshToken(findUser._id);
    const updateuser = await User.findByIdAndUpdate(
        findUser.id,
        {
            refreshToken: refreshToken
        },
        {new:true}
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72*60*60*1000
        });

    // const token = generateToken(findUser._id);  // Replace with the actual token

    // fetch('/protected-route', {
    //     method: 'GET',
    //     headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'Content-Type': 'application/json'
    //     }
    // })
    // .then(response => {
    //     if (!response.ok) throw new Error('Request failed');
    //     return response.json();
    // })
    // .then(data => {
    //     console.log("Data:", data);
    // })
    // .catch(error => {
    //     console.error("Error:", error);
    // });


    res.status(201).json({
        message: 'Logged in successfully',
        data: {
            _id: findUser._id,
            firstname: findUser.firstname,
            lastname: findUser.lastname,
            email: findUser.email,
            mobile: findUser.mobile,
            token: generateToken(findUser._id)
        }
    });
});


//Get all user
exports.getallUsers = catchAsync(async (req,res,next) => {
    const users = await User.find();
    res.json({
        status : 'success',
        results: users.length,
        data: {
            users
        }
    });
});


// Get single user
exports.getUser = catchAsync(async (req,res,next) => {
    const id = req.params;
    validateObjectId(id,next);
    
    const user = await User.findById(req.params.id);

    if (!user){
        return next(new AppError('No user found with that ID',404));
    }
    res.status(200).json({
        status : 'success',
        results: user.length,
        data: {
            user
        }
    });
});


//Handle Refresh Token
exports.handleRefreshToken=catchAsync(async (req,res,next) => {
    const cookie = req.cookies;
    console.log(cookie);
    if(!cookie.refreshToken) {
        return next(new AppError('No refresh token provided',401));
    }
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({ refreshToken });
    if(!user) {
        return next(new AppError('Invalid refresh token',401));
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET,(err,decoded) =>{
        if(err || user.id !== decoded.id){
            return next(new AppError('Invalid refresh token',401));
        }
        const accessToken = generateToken(user._id)
        res.json({accessToken});
    });
    //res.json(user);
});

//logout function
exports.logoutUser = catchAsync(async (req,res,next) => {
    const cookie = req.cookies;
    if(!cookie.refreshToken) {
        return next(new AppError('No refresh token provided',401));
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if (!user) {
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true
        });
        return res.sendStatus(204); //forbidden
    }

    await User.findOneAndUpdate({refreshToken},
        {refreshToken: ""});
    
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true
    });
    return res.sendStatus(204); //forbidden
});


// Update User
exports.updateUser = catchAsync(async (req,res,next) => {
    console.log(req.user);
    const id = req.user.id;
    validateObjectId(id,next);

    const user = await User.findByIdAndUpdate(
        id,
        {
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            email : req.body.email,
            mobile : req.body.mobile
        },
        {new: true}
    );

    if (!user){
        return next(new AppError('No user found with that ID',404));
    }
    res.status(201).json({
        status :'success',
        data: {
            user
        }
    });
});

// Delete user

exports.deleteUser = catchAsync(async (req,res,next) => {
    const { id } =req.params;
    validateObjectId(id,next);

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user){
        return next(new AppError('No user found with that ID',404));
    }
    res.status(204).json({
        status : 'success',
        data: null
    });
});

exports.unblockUser = catchAsync(async (req,res,next) =>{
    const { id } = req.params;
    validateObjectId(id,next);

    const user = await User.findByIdAndUpdate(
        id,
        {
            isBlocked : true
        },
        {
            new: true
        }
    );
    res.json({
        message: "User is unblocked"
    });
});

exports.blockUser = catchAsync(async(req,res,next) =>{
    const { id } = req.params;
    validateObjectId(id,next);

    const user = await User.findByIdAndUpdate(
        id,
        {
            isBlocked : true
        },
        {
            new: true
        }
    );

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.json({
        message: "User is blocked"
    });
});