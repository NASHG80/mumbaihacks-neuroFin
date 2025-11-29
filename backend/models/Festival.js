import mongoose from "mongoose";

const festivalSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true, trim: true },
        date: { type: Date, required: true },
        estimatedSpend: { type: Number, required: true },
        lastYearSpend: { type: Number, default: 0 },
        savedAmount: { type: Number, default: 0 },
        categories: [
            {
                name: { type: String, required: true },
                amount: { type: Number, required: true },
                icon: { type: String, default: "Sparkles" }
            }
        ],
        color: { type: String, default: "#f59e0b" },
        icon: { type: String, default: "PartyPopper" }
    },
    { timestamps: true }
);

const Festival = mongoose.model("Festival", festivalSchema);
export default Festival;
