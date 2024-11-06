const mongoose = require('mongoose');
const dotenv =require('dotenv');
dotenv.config({path : './../config.env'});
const DB = process.env.DATABASE_LOCAL

const dbConnect=()=>{mongoose.connect(DB,{
    //useunidefiedTopology: true,
}).then(con => {
    console.log('Database connected');
}).catch((err) => {
    console.error('Error connecting',err);
})
};

module.exports = dbConnect;