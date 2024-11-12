const Product = require("./../models/productModel");
const AppError = require('./../utils/appError');
const catchAsync = require("./../utils/catchAsync");

exports.createProduct = catchAsync(async (req,res,next) => {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            newProduct
        }
    });
});

exports.getAllProducts = catchAsync(async (req,res,next) =>{
    const products = await Product.find();
    res.status(200).json({
        status: "success",
        results: products.length,
        data: {
            products
        }
    });
});

exports.getaProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product){
        return next(new AppError("Product not found"));
    }
    res.status(200).json({
        status: "success",
        data: {
            product
        }
    })
});