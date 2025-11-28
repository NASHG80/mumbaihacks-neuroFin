import express from "express";
import Transaction from "../models/Transaction.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

function serializeTransaction(tx) {
  return {
    id: tx._id.toString(),
    type: tx.type,
    from: tx.from,
    to: tx.to,
    amount: tx.amount,
    category: tx.category,
    description: tx.description,
    time: tx.time,
    status: tx.status || "completed"
  };
}

router.get("/", authRequired, async (req, res) => {
  try {
    const txs = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(txs.map(serializeTransaction));
  } catch (err) {
    res.status(500).json({ message: "Failed to load transactions" });
  }
});

router.post("/", authRequired, async (req, res) => {
  try {
    const { type, from, to, amount, category, description, time, status } = req.body || {};

    if (!type || typeof amount === "undefined") {
      return res.status(400).json({ message: "Type and amount are required" });
    }

    const tx = await Transaction.create({
      user: req.user.id,
      type,
      from,
      to,
      amount,
      category,
      description,
      time,
      status
    });

    res.status(201).json(serializeTransaction(tx));
  } catch (err) {
    res.status(500).json({ message: "Failed to create transaction" });
  }
});

export default router;
