const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRouter = require('./routes/authRoute');
const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');

dotenv.config({path : './config.env'})
const port = process.env.PORT || 4000;
const dbConnect =require('./config/dbConnect');
dbConnect();

//Middleware
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use("/api/user",authRouter);


//server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//Error handling middleware
app.all('*',(req,res,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
})

app.use(globalErrorHandler);