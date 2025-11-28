import mongoose from "mongoose";

const familyTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    type: { type: String, trim: true },
    time: { type: String, trim: true },
    recurring: { type: Boolean, default: false },
    flow: { type: String, enum: ["in", "out"], default: "out" }
  },
  { timestamps: true }
);

const FamilyTransaction = mongoose.model("FamilyTransaction", familyTransactionSchema);

export default FamilyTransaction;
