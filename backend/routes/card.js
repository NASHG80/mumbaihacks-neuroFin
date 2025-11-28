import express from "express";
import Card from "../models/Card.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// Save or update card
router.post("/", authRequired, async (req, res) => {
  try {
    const userId = req.user.id;

    const existing = await Card.findOne({ userId });

    if (existing) {
      const updated = await Card.findOneAndUpdate(
        { userId },
        { ...req.body },
        { new: true }
      );
      return res.json(updated);
    }

    const created = await Card.create({
      ...req.body,
      userId
    });

    res.json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get card
router.get("/", authRequired, async (req, res) => {
  try {
    const card = await Card.findOne({ userId: req.user.id });
    res.json(card || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
