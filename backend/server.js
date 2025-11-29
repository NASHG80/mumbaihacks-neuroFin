import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// must run BEFORE other imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("ENV CHECK:", {
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// imports
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import goalsRoutes from "./routes/goals.js";
import familyRoutes from "./routes/family.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import transactionsRoutes from "./routes/transactions.js";
import cardRoutes from "./routes/card.js";
import razorpayRoute from "./routes/razorpay.js";
import verifyRoute from "./routes/paymentVerify.js";

// ⭐ ADD THIS ⭐
import startSandboxCron from "./cron/sandboxCron.js";
import sandboxRoutes from "./routes/sandbox.js";
import festivalRoutes from "./routes/festivals.js";
// --------------------

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/family", familyRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/card", cardRoutes);
app.use("/api/razorpay", razorpayRoute);
app.use("/api/payment-verify", verifyRoute);
app.use("/api/sandbox", sandboxRoutes);
app.use("/api/festivals", festivalRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in .env");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // ⭐ START CRON ONLY AFTER DB CONNECTS ⭐
    startSandboxCron();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB");
    console.error(err);
  });