const mongoose = require('mongoose'); 
const validator =require('validator');
const bcrypt = require('bcrypt');

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required:[true,'User must have a name']
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        validate: [validator.isEmail,'please provide a valid email']
    },
    mobile:{
        type:Number,
        required:true,
        unique:true
        //validate: [validator.isMobile,'please provide a valid']
    },
    password:{
        type:String,
        required:true
    },
});

userSchema.pre("save",async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});
userSchema.method.isPasswordMatch = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password);
}

//Export the model
module.exports = mongoose.model('User', userSchema);