const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();
const mid = require("./../middleware/authMiddleware");

router.post("/register",userController.createUser);
router.post("/login",userController.loginUser);
router.get("/all-users",userController.getallUsers);
router
    .route('/:id')
    .get(mid.authMiddleware,mid.isAdmin,userController.getUser)
    .delete(userController.deleteUser);
router.patch("/edit-user",mid.authMiddleware,mid.isAdmin,userController.updateUser);
router.put("/block-user/:id",mid.authMiddleware,mid.isAdmin,userController.blockUser);
router.put("/unblock-user/:id",mid.authMiddleware,mid.isAdmin,userController.unblockUser);

module.exports = router;