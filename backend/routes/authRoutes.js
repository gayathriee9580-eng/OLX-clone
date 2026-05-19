const express = require("express");
const { signup, login , forgotPassword , resetPassword , verifyOtp , resendOtp , updateRoleToSeller} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.put("/update-role", authMiddleware, updateRoleToSeller);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

module.exports = router;