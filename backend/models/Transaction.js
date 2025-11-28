import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    from: { type: String, trim: true },
    to: { type: String, trim: true },
    amount: { type: Number, required: true },
    category: { type: String, trim: true },
    description: { type: String, trim: true },
    time: { type: String, trim: true },
    status: { type: String, default: "completed" }
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
