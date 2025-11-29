import express from "express";
import SandboxCardTransaction from "../models/SandboxTransaction.js";

const router = express.Router();

router.get("/:cardNumber", async (req, res) => {
  try {
    const { cardNumber } = req.params;

    const data = await SandboxTransaction.findOne({ cardNumber });

    res.json(data || { cardNumber, transactions: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

