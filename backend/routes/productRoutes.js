const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const { admin } = require("../middleware/adminMiddleware.js");
const {getProducts , createProduct , getProductById , updateProduct , deleteProduct} = require("../controllers/productController.js")
const multer = require("multer");
const upload = multer({dest : 'upload/'})



const router = express.Router();
// all products
router.route("/").get(getProducts).post(protect,admin,upload.single('image'), createProduct);
// specific product
router.route("/:id").get(getProductById).put(protect,admin,upload.single('image'),updateProduct).delete(protect,admin,deleteProduct);
module.exports = router;
