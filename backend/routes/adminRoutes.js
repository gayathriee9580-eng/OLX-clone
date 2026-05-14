const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {getAllProductsAdmin , deleteAnyProduct, getAllUsersAdmin , blockUser, addProductAdmin , updateProductAdmin} = require("../controllers/adminController");

router.get("/products", authMiddleware, adminMiddleware,getAllProductsAdmin);
router.post("/products", authMiddleware, adminMiddleware,upload.single("image"),addProductAdmin);
router.delete("/products/:id", authMiddleware, adminMiddleware,deleteAnyProduct);
router.get("/users", authMiddleware, adminMiddleware, getAllUsersAdmin);
router.patch("/users/:id/block", authMiddleware, adminMiddleware, blockUser);
router.put("/products/:id",authMiddleware,adminMiddleware,upload.single("image"),updateProductAdmin);

module.exports = router;