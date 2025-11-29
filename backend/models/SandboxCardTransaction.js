import mongoose from "mongoose";

const txnSchema = new mongoose.Schema({
  id: String,
  timestamp: Date,
  merchant: String,
  amount: Number,
  currency: String,
  status: String,
  type: String,
  bank: String,
  description: String
});

const sandboxMonthlySchema = new mongoose.Schema({
  cardNumber: { type: String, required: true, index: true },
  card: { type: mongoose.Schema.Types.ObjectId, ref: "Card" }, // link DB card
  bank: { type: String }, // consistent bank
  months: {
    type: Map,
    of: [txnSchema], // month → list of txns
    default: {}
  },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("SandboxMonthlyTransaction", sandboxMonthlySchema);