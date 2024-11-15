const express = require('express');
const productController = require('./../controllers/productController');
const router = express.Router();
const mid = require('./../middleware/authMiddleware');

router.route("/:id")
    .get(productController.getaProduct)
    .put( mid.authMiddleware ,mid.isAdmin ,productController.updateProduct)
    .delete( mid.authMiddleware ,mid.isAdmin ,productController.deleteProduct);
router.post("/", mid.authMiddleware ,mid.isAdmin ,productController.createProduct);
// router.get("/:id",productController.getaProduct);
router.get("/",productController.getAllProducts);
// router.put("/:id",productController.updateProduct);

module.exports = router;