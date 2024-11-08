const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const generateToken = require("./../config/jwtToken");



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

// Update User

exports.updateUser = catchAsync(async (req,res,next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body,
        {new: true, runValidators: true});

    if (!user){
        return next(new AppError('No user found with that ID',404));
    }
    res.status(200).json({
        status :'success',
        data: {
            user
        }
    });
});

// Delete user

exports.deleteUser = catchAsync(async (req,res,next) => {
    
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user){
        return next(new AppError('No user found with that ID',404));
    }
    res.status(204).json({
        status : 'success',
        data: null
    });
});