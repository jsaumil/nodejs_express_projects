const User = require('../models/userModel');


exports.createUser = async (req, res, next) =>{
    console.log("Request body:", req.body);
    try{
    const newUser = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password
    });
        res.status(201).json({
            message: 'User created successfully',
            data: {
                user: newUser
            }
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: 'Failed to create user',
            error: err
        });
    }
};