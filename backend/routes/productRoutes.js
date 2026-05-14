const express = require("express");
const { createProduct, getProducts , getSingleProduct , updateProduct , deleteProduct , getMyProducts} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post( "/", authMiddleware,upload.single("image"),createProduct);
router.get("/", getProducts);
router.get("/my-products", authMiddleware, getMyProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;