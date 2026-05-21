const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const signup = async (req, res) => {
  try {
let { name, email, password, role, phone } = req.body;

name = name?.trim();
email = email?.trim().toLowerCase();
phone = phone?.trim();
password = password?.trim();

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (name.length < 3) {
      return res.status(400).json({
        message: "Name must be at least 3 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const passwordRegex = /^(?=.*\d).{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters and contain a number",
      });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Enter valid 10 digit phone number",
      });
    }

    const allowedRoles = ["buyer", "seller"];

    if (!allowedRoles.includes(role)) {
      role = "buyer";
    }

const existingUser = await User.findOne({ email });

if (existingUser) {

  // already verified user
  if (existingUser.isVerified) {
    return res.status(400).json({
      message: "Email already registered",
    });
  }

  // user exists but not verified → resend OTP
  const newOtp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  existingUser.otp = newOtp;
  existingUser.otpExpire = Date.now() + 10 * 60 * 1000;

  await existingUser.save();

  await sendEmail(
    existingUser.email,
    "OLX Clone OTP Verification",
    `Your OTP is ${newOtp}. It will expire in 10 minutes.`
  );

  return res.status(200).json({
    message: "OTP resent to your email",
    email: existingUser.email,
  });
}

    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        message: "Phone number already used",
      });
    }

const hashedPassword = await bcrypt.hash(password, 10);

const otp = Math.floor(
  100000 + Math.random() * 900000
).toString();

const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role: role === "seller" ? "seller" : "buyer",
  phone,
  isVerified: false,
  otp,
  otpExpire: Date.now() + 10 * 60 * 1000,
});

// TEMPORARY TESTING
// email sending skip cheyyunnu

res.status(201).json({
  message: "User registered successfully",
  email: user.email,
});

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const jwt = require("jsonwebtoken");

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.isBlocked) {
    return res.status(403).json({
      message: "Your account has been blocked by admin",
    });
  }

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify OTP before login",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    res.json({
      message: "Reset token generated",
      resetLink: `https://olx-clone-dusky-seven.vercel.app/reset-password/${resetToken}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    user.isVerified = true;

    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "User already verified",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(
      user.email,
      "Resend OTP - OLX Clone",
      `Your new OTP is ${otp}`
    );

    res.json({
      message: "New OTP sent to email",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateRoleToSeller = async (req, res) => {
  try {
   
    const userId = req.user.id; 

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "seller" },
      { new: true } 
    ).select("-password"); 

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Role updated to seller successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { signup, login , forgotPassword , resetPassword , verifyOtp , resendOtp , updateRoleToSeller};