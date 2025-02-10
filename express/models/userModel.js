const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// name,email,password,photo,password and passwordconfirm

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name'],
        //trim: true,
        //maxlength: [50, 'Name must have less or equal to 50 characters']
    },
    email:{
        type: String,
        required: [true, 'User must have a email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,'Please provide a valid email']
    },
    photo : String,
    password:{
        type: String,
        required: [true,'Please provide a password'],
        minlength: 8,
    },
    passwordConfirm:{
        type: String,
        required: [true,'Please provide confirm a password'],
        validate: {
            //this only works on CREATE and SAVE!!!
            validator: function(el){
                return el === this.password;
            },
            message: 'Passwords must match'
        }
    }
});

userSchema.pre('save',async function(next){
    //Only run this fxn if password is modified
    if(!this.isModified('password')) return next();

    //Hash the password before saving it to the database
    this.password = await bcrypt.hash(this.password,12);
    
    //Delete the passwordConfirm field as it's not needed after hashing
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User',userSchema);

module.exports = User;