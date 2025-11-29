import express from "express";
import Festival from "../models/Festival.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authRequired, async (req, res) => {
    try {
        console.log(`Fetching festivals for user: ${req.user.id}`);
        const festivals = await Festival.find({ user: req.user.id }).sort({ date: 1 });
        console.log(`Found ${festivals.length} festivals`);
        res.json(festivals);
    } catch (err) {
        console.error("Error fetching festivals:", err);
        res.status(500).json({ message: "Failed to load festivals" });
    }
});

router.post("/", authRequired, async (req, res) => {
    try {
        const { name, date, estimatedSpend, lastYearSpend, categories, color, icon } = req.body;

        const festival = await Festival.create({
            user: req.user.id,
            name,
            date,
            estimatedSpend,
            lastYearSpend,
            categories,
            color,
            icon
        });

        console.log("Created festival:", festival);
        res.status(201).json(festival);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create festival" });
    }
});

router.put("/:id", authRequired, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const festival = await Festival.findOneAndUpdate(
            { _id: id, user: req.user.id },
            updates,
            { new: true }
        );

        if (!festival) {
            return res.status(404).json({ message: "Festival not found" });
        }

        res.json(festival);
    } catch (err) {
        res.status(500).json({ message: "Failed to update festival" });
    }
});

router.post("/:id/save", authRequired, async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        const festival = await Festival.findOne({ _id: id, user: req.user.id });
        if (!festival) {
            return res.status(404).json({ message: "Festival not found" });
        }

        festival.savedAmount += Number(amount);
        await festival.save();

        res.json(festival);
    } catch (err) {
        res.status(500).json({ message: "Failed to save amount" });
    }
});

export default router;
