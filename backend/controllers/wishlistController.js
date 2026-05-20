const User = require("../models/User");
const Product = require("../models/Product"); 

// ADD
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const productId = req.params.productId;

    const user = await User.findById(userId);

    if (!user.wishlist.some(id => id.toString() === productId)) {
      user.wishlist.push(productId);
    }

    await user.save();

    res.json({ message: "Added to wishlist ❤️" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {

    $pull: { wishlist: req.params.productId }
    });

    res.json({ message: "Removed from wishlist ❌" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getWishlist = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user.id).populate({
    path: "wishlist",
    strictPopulate: false, // 🔥 FIX
    });    

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.wishlist || []);
  } catch (err) {
    console.log("GET WISHLIST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};