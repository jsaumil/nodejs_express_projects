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
    role: {
        type: String,
        default: "user"
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Address"
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product"
    }]
},{
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
}
);

userSchema.methods.isPasswordMatch = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save",async function(next){
    if(!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});


//Export the model
const User = mongoose.model('User', userSchema);
module.exports = User;