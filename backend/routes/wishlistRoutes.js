const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishlistController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/:productId", authMiddleware, addToWishlist);
router.delete("/:productId", authMiddleware, removeFromWishlist);
router.get("/", authMiddleware, getWishlist);

module.exports = router;