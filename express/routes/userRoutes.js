const express = require('express');
const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController.js');

const router = express.Router();

router.post('/signup',authController.signup);

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;