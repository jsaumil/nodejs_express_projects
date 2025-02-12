//const fs = require('fs');
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');


// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res,next,val) => {
//     console.log(`Tour id is ${val}`);

//     if (req.params.id*1 > tours.length){
//         return res.status(404).json({
//             status : 'fail',
//             message: 'Invalid ID'
//         });
//     }
//     next();
// };

// exports.checkBody = (req, res, next) =>{
//     if(!req.body.name || !req.body.price){
//         return res.status(400).json({
//             status : 'fail',
//             message: 'Missing name or price'
//         });
//     }
//     next();
// } 
exports.aliasTopTours=(req,res,next) =>{
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields ='name,price,ratingsAverage,summary,difficulty';
    next();
};


exports.getAllTours = catchAsync(async (req,res,next) => {
    // console.log(req.requestTime);
    // try{
        console.log(req.query);
        //BUILD QUERY
        //1A) Filtering
        // const queryObj = {...req.query};
        // const excludeFields = ['page','sort','limit','fields'];
        // excludeFields.forEach(el => delete queryObj[el]);

        //1B) Advanced filtering

        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // console.log(JSON.parse(queryStr));  

        // this.query.find(JSON.parse(queryStr))

        //let query = Tour.find(JSON.parse(queryStr));

        //2) Sorting
        // if(req.query.sort){
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     console.log(sortBy);
        //     query = query.sort(req.query.sort)
        // }else{
        //     query = query.sort('-createdAt');
        // }

        //3) Field limiting
        // if (req.query.field){
        //     const fields = req.query.field.split(',').join(' ');
        //     query = query.select(fields);
        // }else{
        //     query = query.select('-__v');
        // }

        //4) Pagination
        // const page = req.query.page * 1 || 1;
        // const limit = req.query.limit * 1 || 100;
        // const skip = (page - 1) * limit;

        // query = query.skip(skip).limit(limit)

        // if (req.query.page){
        //     const numTours = await Tour.countDocuments();
        //     if(skip >= numTours) throw new Error('This page does not exist');
        // }

        //EXECUTE QUERY
        const features = new APIFeatures(Tour.find(),req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

        //SEND RESPONSE
        res.status(200).json({
            status : 'success',
            //requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        });
    // }catch(err){
    //     res.status(404).json({
    //         status : 'fail',
    //         message: err
    //     });
    // }
});

exports.getTour = catchAsync(async (req,res,next) =>{
    // try{
        const tour = await Tour.findById(req.params.id);
        //Tour.findOne({_id:req.params.id})

        if (!tour) {
           return next(new AppError('No tour found with that ID',404))
        }
        res.status(200).json({
            status : 'success',
            results: tour.length,
            data: {
                tour
            }
        });
    // }
    // catch(err){
    //     res.status(404).json({
    //         status : 'fail',
    //         message: err
    //     });
    // }
    // console.log(req.params);

    // const id = req.params.id * 1;
    // if(id > tours.length) {
    //     return res.status(404).json({
    //         status : 'fail',
    //         message: 'Invalid ID'
    //     });
    // }

    // const tour = tours.find(el => el.id === id)

    
    // res.status(200).json({
    //     status: 'success',
    //     // results: tours.length,
    //     data: {
    //         tour
    //     }
    // });
});

exports.createTour = catchAsync(async (req,res,next) => {
    // try{

        //const tour newTour =new Tour({})
        //newTour.save()

        const newTour = await Tour.create(req.body);
        //console.log(req.body);

        // const newId = tours[tours.length - 1].id +1;
        // const newTour = Object.assign({id : newId},req.body);

        // tours.push(newTour);
        // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err => {
        
            res.status(201).json({
                status : 'success',
                data: {
                    tour: newTour
                }
            });
    // } 
    
    // catch (err){
    //     res.status(400).json({
    //         status : 'fail',
    //         message: err
    //     })
    // }
    
});

exports.updateTour = catchAsync(async (req,res,next) => {
    
    // if(req.params.id * 1 > tours.length) {
    //     return res.status(404).json({
    //         status : 'fail',
    //         message: 'Invalid ID'
    //     });
    // }
    // try{
        const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        })

        if (!tour) {
            return next(new AppError('No tour found with that ID',404))
         }

        res.status(200).json({
            status : 'success',
            data:{
                tour
            }
        });
    // }
    // catch(err){
    //     res.status(404).json({
    //         status : 'fail',
    //         message: err
    //     });
    // }
});

exports.deleteTour = catchAsync(async (req,res,next) => {
    
    // if(req.params.id * 1 > tours.length) {
    //     return res.status(404).json({
    //         status : 'fail',
    //         message: 'Invalid ID'
    //     });
    // }
    // try{
       const tour = await Tour.findByIdAndDelete(req.param.id);

        if (!tour) {
            return next(new AppError('No tour found with that ID',404))
         }

        res.status(204).json({
            status : 'success',
            data: null
        });
    // }
    // catch(err){
    //     res.status(404).json({
    //         status : 'fail',
    //         message: err
    //     });
    // }
});


exports.getTourStats = catchAsync(async (req,res,next) => {
    // try{
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage : {$gte:4.5}}
            },
            {
                $group: {
                    _id: '$difficulty',
                    num: {$sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            },
            {
                $sort: {
                    avgPrice: 1
                }
            }
            // {
            //     $match: {_id: {$ne:'easy'}}
            // }
        ]);

        res.status(200).json({
            status : 'success',
            data:{
                stats
            }
        });
    // }catch(err){
    //     res.status(404).json({
    //         status : 'fail',
    //         message: err
    //     });
    // }
});

exports.getMonthlyPlan = catchAsync(async (req,res,next) => {
    // try{
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates'},
                    numTourStarts: {$sum: 1},
                    tours: {$push: '$name'}
                }
            },
            {
                $addFields: {month: '$_id'}
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: {numTourStarts: -1}
            },
            {
                $limit: 6
            }
        ]);

        res.status(200).json({
            status : 'success',
            data:{
                plan
            }
        });
    // }catch(err){
    //     res.status(404).json({
    //         status : 'fail',
    //         message: err
    //     });
    // }
});