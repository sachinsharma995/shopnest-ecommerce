const Razorpay = require("razorpay");
const crypto = require("crypto");

require("dotenv").config();

// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

   
    // ==========================================
    // AMOUNT VALIDATION
    // ==========================================

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    // ==========================================
    // RAZORPAY KEY CHECK
    // ==========================================

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      console.error("❌ Razorpay keys are missing");

      return res.status(503).json({
        success: false,
        message:
          "Razorpay keys are not configured.",
      });
    }

    // ==========================================
    // CREATE RAZORPAY INSTANCE
    // ==========================================

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // ==========================================
    // CREATE RAZORPAY ORDER
    // ==========================================

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `shopnest_${Date.now()}`,
    };

    const order =
      await razorpay.orders.create(options);


    // ==========================================
    // SEND ORDER TO FRONTEND
    // ==========================================

    return res.status(200).json({
      success: true,

      // Razorpay mode
      mode: "razorpay",

      // Old project compatible response
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error(
      "❌ CREATE RAZORPAY ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create Razorpay order",
      error: error.message,
    });
  }
};


// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    console.log(
      "Verifying Razorpay payment..."
    );

    // ==========================================
    // CHECK PAYMENT DATA
    // ==========================================

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment details are missing.",
      });
    }

    // ==========================================
    // CHECK RAZORPAY SECRET
    // ==========================================

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({
        success: false,
        message:
          "Razorpay is not configured.",
      });
    }

    // ==========================================
    // CREATE SIGNATURE
    // ==========================================

    const sign =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSign = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(sign)
      .digest("hex");

    // ==========================================
    // VERIFY SIGNATURE
    // ==========================================

    if (
      razorpay_signature !== expectedSign
    ) {
      console.log(
        "❌ Invalid Razorpay signature"
      );

      return res.status(400).json({
        success: false,
        message:
          "Invalid payment signature.",
      });
    }

    // ==========================================
    // PAYMENT VERIFIED
    // ==========================================

    console.log(
      "✅ Razorpay payment verified"
    );

    return res.status(200).json({
      success: true,
      message:
        "Payment verified successfully",
    });

  } catch (error) {
    console.error(
      "❌ VERIFY PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Payment verification failed.",
    });
  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createOrder,
  verifyPayment,
};