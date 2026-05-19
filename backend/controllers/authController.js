const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Signup user
const signup = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

const hashedPassword = await bcrypt.hash(password, 10);

const otp = Math.floor(100000 + Math.random() * 900000).toString();

if (!/^[0-9]{10}$/.test(phone)) {
  return res.status(400).json({
    message: "Enter valid 10 digit phone number",
  });
}
const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role,
  phone,
  isVerified: false,
  otp,
  otpExpire: Date.now() + 10 * 60 * 1000,
});

try {
  await sendEmail(
    user.email,
    "OLX Clone OTP Verification",
    `Your OTP is ${otp}. It will expire in 10 minutes.`
  );
} catch (emailError) {
  console.log("Email error:", emailError);

  // ❗ rollback user
  await User.findByIdAndDelete(user._id);

  return res.status(500).json({
    message: "Failed to send OTP. Please try again.",
  });
}

res.status(201).json({
  message: "User registered. OTP sent to your email",
  email: user.email,
});

  } catch (error) {
    res.status(500).json({ message: error.message });
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

// ✅ യൂസറുടെ റോൾ 'buyer'ൽ നിന്നും 'seller'ലേക്ക് അപ്ഡേറ്റ് ചെയ്യാനുള്ള കൺട്രോളർ
const updateRoleToSeller = async (req, res) => {
  try {
    // authMiddleware ഉള്ളതുകൊണ്ട് req.user.id-ൽ നിന്ന് ലോഗിൻ ചെയ്ത യൂസറുടെ ID കിട്ടും
    const userId = req.user.id; 

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "seller" },
      { new: true } // അപ്ഡേറ്റ് ചെയ്ത പുതിയ ഡാറ്റ റെസ്പോൺസിൽ കിട്ടാൻ
    ).select("-password"); // പാസ്‌വേഡ് ഫീൽഡ് ഒഴിവാക്കി ബാക്കി ഡാറ്റ എടുക്കുന്നു

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