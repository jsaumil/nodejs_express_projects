const jwt = require('jsonwebtoken');
const dotenv =require('dotenv');
dotenv.config({path : './../config.env'});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
}

module.exports = generateToken;