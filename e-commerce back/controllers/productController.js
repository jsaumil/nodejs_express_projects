const Product = require("./../models/productModel");
const Category = require("./../models/categoryModel");
const AppError = require('./../utils/appError');
const catchAsync = require("./../utils/catchAsync");
const slugify = require("slugify");

//Create Product
exports.createProduct = catchAsync(async (req,res,next) => {
    //generate slug
    if(req.body.title){
        req.body.slug=slugify(req.body.title);
    }

    //Validate and transform category to ObjectId
    const categoryName = req.body.category.trim();
    const categoryDoc = await Category.findOne({name: categoryName});
    if(!categoryDoc){
        console.log('Category not found:', req.body.category);
        return next(new AppError('Invalid category',404));
    }
    req.body.category = categoryDoc._id;

    // Validate the color field
    const allowedColors = ["Black", "Brown", "Red"];
    if (req.body.color && !allowedColors.includes(req.body.color)) {
        return next(new AppError(`Invalid color: ${req.body.color}. Allowed values are ${allowedColors.join(", ")}`, 400));
    }


    const product = await Product.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            product
        }
    });
});


//Update Product
exports.updateProduct = catchAsync(async (req,res,next) => {
    if(req.body.title){
        req.body.slug=slugify(req.body.title);
    }
    const product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators: true
    });

    if(!product){
        return next(new AppError('Product not found',404));
    }

    res.status(200).json({
        status: "success",
        data: {
            product
        }
    });
});

exports.deleteProduct = catchAsync(async (req,res,next) => {
    
    const product = await Product.findByIdAndDelete(req.params.id);

    if(!product){
        return next(new AppError('Product not found',404));
    }

    res.status(204).json({
        status: "success",
        data: null
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