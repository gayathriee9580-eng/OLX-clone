const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
      phone: {
      type: String,
      required: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
        isVerified: {
      type: Boolean,
      default: false,
    },
      wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

    otp: String,

    otpExpire: Date,

    resetPasswordToken: String,

    resetPasswordExpire: Date,
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);