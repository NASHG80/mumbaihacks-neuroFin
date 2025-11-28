import express from "express";
import Goal from "../models/Goal.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

function serializeGoal(goal) {
  return {
    id: goal._id.toString(),
    name: goal.name,
    target: goal.target,
    current: goal.current,
    emoji: goal.emoji,
    color: goal.color
  };
}

router.get("/", authRequired, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.json(goals.map(serializeGoal));
  } catch (err) {
    res.status(500).json({ message: "Failed to load goals" });
  }
});

router.post("/", authRequired, async (req, res) => {
  try {
    const { name, target, current, emoji, color } = req.body;

    if (!name || typeof target === "undefined" || typeof current === "undefined") {
      return res.status(400).json({ message: "Name, target and current are required" });
    }

    const goal = await Goal.create({
      user: req.user.id,
      name,
      target,
      current,
      emoji,
      color
    });

    res.status(201).json(serializeGoal(goal));
  } catch (err) {
    res.status(500).json({ message: "Failed to create goal" });
  }
});

router.put("/:id", authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, target, current, emoji, color } = req.body || {};

    const goal = await Goal.findOne({ _id: id, user: req.user.id });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (typeof name !== "undefined") goal.name = name;
    if (typeof target !== "undefined") goal.target = target;
    if (typeof current !== "undefined") goal.current = current;
    if (typeof emoji !== "undefined") goal.emoji = emoji;
    if (typeof color !== "undefined") goal.color = color;

    await goal.save();

    res.json(serializeGoal(goal));
  } catch (err) {
    res.status(500).json({ message: "Failed to update goal" });
  }
});

router.delete("/:id", authRequired, async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findOneAndDelete({ _id: id, user: req.user.id });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete goal" });
  }
});

export default router;
