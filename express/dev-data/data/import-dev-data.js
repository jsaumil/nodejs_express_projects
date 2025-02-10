const fs = require('fs');
const mongoose = require('mongoose');
const dotenv =require('dotenv');
const Tour = require('./../../models/tourModel')

dotenv.config({path : './config.env'});


const DB = process.env.DATABASE_LOCAL

mongoose.connect(DB,{
    useUnifiedTopology: true
}).then(con => {
    console.log(con.connection);
    console.log('DB connection successful');
}).catch((err) => {
    console.error('Error connecting to DB:', err);
});

// READ JSON file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8')
);

// Import Data Into DB
const importData = async () => {
    try{
        await Tour.create(tours);
        console.log('Data Imported Successfully');
        process.exit();
    }catch(err){
        console.log(err)
    }
};

// Delete Data from DB

const deleteData = async () => {
    try{
        await Tour.deleteMany();
        console.log('Data Deleted Successfully');
        process.exit();
    }catch(err){
        console.log(err);
    }
};

if(process.argv[2] === '--import'){
    importData();
} else if (process.argv[2] === '--delete'){
    deleteData();
}

//console.log(process.argv);
