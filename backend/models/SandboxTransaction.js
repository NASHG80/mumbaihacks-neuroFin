import mongoose from "mongoose";

const SandboxTransactionSchema = new mongoose.Schema({
  card: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
  cardNumber: String,
  bank: String,
  month: String,         // YYYY-MM
  timestamp: Date,
  merchant: String,
  amount: Number,
  currency: String,
  status: String,
  type: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("SandboxTransaction", SandboxTransactionSchema);
