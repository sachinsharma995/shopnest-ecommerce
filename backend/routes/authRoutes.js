const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getUsers,
} = require("../controllers/authController.js");

const { protect } = require("../middleware/authMiddleware.js");
const { admin } = require("../middleware/adminMiddleware.js");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Registration OTP
router.post("/verify-otp", verifyOtp);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Verify Forgot Password OTP
router.post("/verify-reset-otp", verifyResetOtp);

// Reset Password
router.post("/reset-password", resetPassword);

// Admin - Get Users
router.get("/users", protect, admin, getUsers);

module.exports = router;