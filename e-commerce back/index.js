const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const AppError = require('./utils/appError');
const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./controllers/errorController');

dotenv.config({path : './config.env'})
const port = process.env.PORT || 4000;
const dbConnect =require('./config/dbConnect');
dbConnect();

//Middleware
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());

app.use("/api/user",authRouter);
app.use("/api/product",productRouter);

//server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//Error handling middleware
app.all('*',(req,res,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
})

app.use(globalErrorHandler);