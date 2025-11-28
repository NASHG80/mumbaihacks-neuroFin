import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true }, // e.g. "Entertainment", "Investment"
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true }, // Critical for Calendar Link
    cycle: { 
      type: String, 
      enum: ["monthly", "yearly", "weekly"], 
      default: "monthly" 
    },
    icon: { type: String, default: "Zap" }, // Store icon name (e.g. "Netflix")
    theme: { type: String, default: "blue" }, // Store UI theme color
    reminder: { type: Boolean, default: true } // Toggle for notifications
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;