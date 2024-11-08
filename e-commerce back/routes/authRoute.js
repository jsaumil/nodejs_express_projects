const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();
const authMiddleware = require("./../middleware/authMiddleware");

router.post("/register",userController.createUser);
router.post("/login",userController.loginUser);
router.get("/all-users",userController.getallUsers);
router
    .route('/:id')
    .get(authMiddleware,userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;