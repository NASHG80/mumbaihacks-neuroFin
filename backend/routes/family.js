import express from "express";
import FamilyMember from "../models/FamilyMember.js";
import FamilyTransaction from "../models/FamilyTransaction.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

function serializeMember(member) {
  return {
    id: member._id.toString(),
    name: member.name,
    role: member.role,
    avatar: member.avatar,
    color: member.color,
    contribution: member.contribution,
    expenses: member.expenses,
    savings: member.savings,
    status: member.status,
    age: member.age,
    goals: member.goals || []
  };
}

function serializeTransaction(tx) {
  return {
    id: tx._id.toString(),
    from: tx.from,
    to: tx.to,
    amount: tx.amount,
    type: tx.type,
    time: tx.time,
    recurring: tx.recurring,
    flow: tx.flow
  };
}

router.get("/members", authRequired, async (req, res) => {
  try {
    const members = await FamilyMember.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.json(members.map(serializeMember));
  } catch (err) {
    res.status(500).json({ message: "Failed to load family members" });
  }
});

router.post("/members", authRequired, async (req, res) => {
  try {
    const {
      name,
      role,
      avatar,
      color,
      contribution,
      expenses,
      savings,
      status,
      age,
      goals
    } = req.body || {};

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const member = await FamilyMember.create({
      user: req.user.id,
      name,
      role,
      avatar: avatar || (name && name[0] ? name[0].toUpperCase() : ""),
      color,
      contribution,
      expenses,
      savings,
      status,
      age,
      goals
    });

    res.status(201).json(serializeMember(member));
  } catch (err) {
    res.status(500).json({ message: "Failed to create family member" });
  }
});

router.delete("/members/:id", authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const member = await FamilyMember.findOneAndDelete({ _id: id, user: req.user.id });

    if (!member) {
      return res.status(404).json({ message: "Family member not found" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete family member" });
  }
});

router.get("/transactions", authRequired, async (req, res) => {
  try {
    const txs = await FamilyTransaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(txs.map(serializeTransaction));
  } catch (err) {
    res.status(500).json({ message: "Failed to load family transactions" });
  }
});

router.post("/transactions", authRequired, async (req, res) => {
  try {
    const { from, to, amount, type, time, recurring, flow } = req.body || {};

    if (!from || !to || typeof amount === "undefined") {
      return res.status(400).json({ message: "From, to and amount are required" });
    }

    const tx = await FamilyTransaction.create({
      user: req.user.id,
      from,
      to,
      amount,
      type,
      time,
      recurring,
      flow
    });

    res.status(201).json(serializeTransaction(tx));
  } catch (err) {
    res.status(500).json({ message: "Failed to create family transaction" });
  }
});

router.put("/transactions/:id", authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to, amount, type, time, recurring, flow } = req.body || {};

    const tx = await FamilyTransaction.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { from, to, amount, type, time, recurring, flow },
      { new: true }
    );

    if (!tx) {
      return res.status(404).json({ message: "Family transaction not found" });
    }

    res.json(serializeTransaction(tx));
  } catch (err) {
    res.status(500).json({ message: "Failed to update family transaction" });
  }
});

export default router;
