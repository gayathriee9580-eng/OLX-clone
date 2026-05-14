const Product = require("../models/Product");

const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAnyProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted by admin",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const User = require("../models/User");

const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked ? "User blocked" : "User unblocked",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addProductAdmin = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);

    const sellerId = req.user?._id || req.user?.id;

    if (!sellerId) {
      return res.status(401).json({
        message: "Admin user not found from token",
      });
    }

    const product = await Product.create({
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      location: req.body.location,
      image: req.file ? req.file.filename : "",
      seller: sellerId,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.log("ADD PRODUCT ERROR:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};
const updateProductAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.location = req.body.location || product.location;

    // ✅ price safe update
    product.price =
      req.body.price !== undefined
        ? Number(req.body.price)
        : product.price;

    // ✅ image update
    if (req.file) {
      product.image = req.file.filename;
    }

    const updatedProduct = await product.save();

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProductsAdmin,
  deleteAnyProduct,
  getAllUsersAdmin,
  blockUser,
  addProductAdmin,
  updateProductAdmin,
};