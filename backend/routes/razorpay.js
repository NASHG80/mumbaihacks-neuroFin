import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

// Create order route
router.post("/create-order", async (req, res) => {
  try {
    // Create Razorpay instance *inside* the route,
    // so dotenv has already loaded before this runs.
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: 89900, // ₹899
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    console.log("ORDER CREATED:", order);

    return res.json(order);
  } catch (error) {
    console.error("Razorpay order error:", error);
    return res.status(500).json({ error: "Order creation failed" });
  }
});

export default router;
