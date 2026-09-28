const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Generate JWT Token

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// Register User

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP expires after 10 minutes
    const otpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Create normal user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      verified: false,
      otp: otp,
      otpExpires: otpExpires,
    });

    // Email message
    const message = `
      <h2>Welcome to ShopNest, ${name}!</h2>

      <p>
        Thank you for registering with ShopNest.
      </p>

      <p>
        Your email verification OTP is:
      </p>

      <h1 style="color: #f97316; letter-spacing: 8px;">
        ${otp}
      </h1>

      <p>
        This OTP will expire in <strong>10 minutes</strong>.
      </p>

      <p>
        Please do not share this OTP with anyone.
      </p>

      <p>
        Thank you,<br>
        <strong>ShopNest Team</strong>
      </p>
    `;

    // Send email
    const emailSent = await sendEmail(
      email,
      "ShopNest - Email Verification OTP",
      message
    );

    // Email failed
    if (!emailSent) {
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        message:
          "OTP email could not be sent. Please check email configuration and try again.",
      });
    }

    // Registration successful
    res.status(201).json({
      message:
        "Registration successful. OTP sent to your email.",
      email: user.email,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Verify Registration OTP

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Already verified
    if (user.verified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    // OTP doesn't exist
    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        message:
          "OTP not found. Please register again.",
      });
    }

    // OTP expired
    if (new Date() > user.otpExpires) {
      return res.status(400).json({
        message:
          "OTP expired. Please register again.",
      });
    }

    // Wrong OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // OTP correct
    user.verified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.status(200).json({
      message:
        "Email verified successfully. You can now login.",
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Login User

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check email/password
    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Normal users must verify email
    // Admin does NOT need OTP verification
    if (user.role !== "admin" && !user.verified) {
      return res.status(401).json({
        message:
          "Please verify your email with OTP before login.",
      });
    }

    // Login successful
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =====================================================
// Forgot Password - Send Reset OTP
// =====================================================

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check email
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Admin password reset is not allowed
    if (user.role === "admin") {
      return res.status(403).json({
        message:
          "Admin password reset is not available here.",
      });
    }

    // Generate 6 digit reset OTP
    const resetOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Reset OTP expires after 10 minutes
    const resetOtpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Save reset OTP
    user.resetOtp = resetOtp;
    user.resetOtpExpires = resetOtpExpires;

    await user.save();

    // Email message
    const message = `
      <h2>ShopNest Password Reset</h2>

      <p>Hello ${user.name},</p>

      <p>
        We received a request to reset your ShopNest password.
      </p>

      <p>
        Your password reset OTP is:
      </p>

      <h1 style="color: #f97316; letter-spacing: 8px;">
        ${resetOtp}
      </h1>

      <p>
        This OTP will expire in
        <strong>10 minutes</strong>.
      </p>

      <p>
        If you did not request a password reset,
        you can safely ignore this email.
      </p>

      <p>
        Thank you,<br>
        <strong>ShopNest Team</strong>
      </p>
    `;

    // Send email
    const emailSent = await sendEmail(
      email,
      "ShopNest - Password Reset OTP",
      message
    );

    // Email failed
    if (!emailSent) {
      user.resetOtp = null;
      user.resetOtpExpires = null;

      await user.save();

      return res.status(500).json({
        message:
          "OTP email could not be sent. Please try again.",
      });
    }

    // Success
    res.status(200).json({
      message:
        "Password reset OTP sent to your email.",
      email: user.email,
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Verify Password Reset OTP

const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Admin cannot use password reset
    if (user.role === "admin") {
      return res.status(403).json({
        message:
          "Admin password reset is not available here.",
      });
    }

    // Check reset OTP
    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({
        message:
          "Reset OTP not found. Please request a new OTP.",
      });
    }

    // Check OTP expiry
    if (new Date() > user.resetOtpExpires) {
      return res.status(400).json({
        message:
          "OTP expired. Please request a new OTP.",
      });
    }

    // Check OTP
    if (user.resetOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // OTP correct
    res.status(200).json({
      message: "OTP verified successfully.",
    });

  } catch (error) {
    console.error(
      "VERIFY RESET OTP ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Reset Password

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Check required fields
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message:
          "Email, OTP and new password are required",
      });
    }

    // Check password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Admin cannot reset password
    if (user.role === "admin") {
      return res.status(403).json({
        message:
          "Admin password reset is not available here.",
      });
    }

    // Check reset OTP
    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({
        message:
          "Invalid reset request. Please request OTP again.",
      });
    }

    // Check OTP expiry
    if (new Date() > user.resetOtpExpires) {
      return res.status(400).json({
        message:
          "OTP expired. Please request a new OTP.",
      });
    }

    // Check OTP
    if (user.resetOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      newPassword,
      salt
    );

    // Update password
    user.password = hashedPassword;

    // Clear reset OTP
    user.resetOtp = null;
    user.resetOtpExpires = null;

    await user.save();

    res.status(200).json({
      message:
        "Password reset successfully. You can now login.",
    });

  } catch (error) {
    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get Users

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password -otp -otpExpires -resetOtp -resetOtpExpires")
      .sort({ createdAt: -1 })
      .lean();

    const usersWithDate = users.map((user) => {
      // If createdAt exists
      if (user.createdAt) {
        return user;
      }

      // For old users, use MongoDB ObjectId timestamp
      if (
        user._id &&
        typeof user._id.getTimestamp === "function"
      ) {
        return {
          ...user,
          createdAt: user._id.getTimestamp(),
        };
      }

      return user;
    });

    res.status(200).json(usersWithDate);

  } catch (error) {
    console.error("GET USERS ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Export Controllers

module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getUsers,
};