import express from "express";
import SandboxCardTransaction from "../models/SandboxCardTransaction.js";

const router = express.Router();

router.get("/:cardNumber", async (req, res) => {
  try {
    const { cardNumber } = req.params;

    const data = await SandboxCardTransaction.findOne({ cardNumber });

    res.json(data || { cardNumber, transactions: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;