import mongoose from "mongoose";

const familyMemberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    avatar: { type: String, trim: true },
    color: { type: String, default: "#3BF7FF" },
    contribution: { type: Number, default: 0 },
    expenses: { type: Number, default: 0 },
    savings: { type: Number, default: 0 },
    status: { type: String, default: "member" },
    age: { type: Number },
    goals: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

const FamilyMember = mongoose.model("FamilyMember", familyMemberSchema);

export default FamilyMember;
