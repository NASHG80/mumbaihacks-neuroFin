import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    target: { type: Number, required: true },
    current: { type: Number, required: true, default: 0 },
    emoji: { type: String, default: "🎯" },
    color: { type: String, default: "#3BF7FF" }
  },
  { timestamps: true }
);

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
