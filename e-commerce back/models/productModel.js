const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    sold:{
        type: Number,
        default: 0
    },
    images: {
        type: Array,
    },
    brand:{
        type: String,
        enum:["Apple","Samsung","Lenovo"]
    },
    color: {
        type: String,
        enum:["Black","Brown","Red"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    rating:[{
        star: Number,
        postedby: {type: mongoose.Schema.Types.ObjectId, ref:"User"}
    }]
},{
    timestamps: true
}
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product