const mongoose = require('mongoose');
const dotenv =require('dotenv');
dotenv.config({path : './config.env'});

const app = require('./app');

const DB = process.env.DATABASE_LOCAL

mongoose.connect(DB,{
    //useUnifiedTopology: true
}).then(con => {
    //console.log(con.connection);
    console.log('DB connection successful');
}).catch((err) => {
    console.error('Error connecting to DB:', err);
});

//console.log(process.env);

const port = process.env.PORT || 3000;
const server=app.listen(port , () =>{
    console.log(`App running on port ${port}....`)
});

process.on('unhandledRejection',err => {
    console.log(err.name,err.message);
    console.log('UNHANDLER REJECCTION! Shutting down...')
    server.close(()=>{
        process.exit(1);
    });
});

process.on('uncaughtException',err => {
    console.log('UNHANDLER REJECCTION! Shutting down...')
    console.log(err.name, err.message);
    server.close(()=>{
        process.exit(1);
    });
});