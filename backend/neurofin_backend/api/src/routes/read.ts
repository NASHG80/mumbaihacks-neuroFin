import { Router } from "express";
import { getDb } from "../db";

const router = Router();

// GET /api/v1/smoothed/:user_id?limit=30
router.get("/smoothed/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const limit = Number(req.query.limit || 30);
    const db = getDb();

    const docs = await db
      .collection("smoothed_balances")
      .find({ user_id })
      .sort({ as_of: -1 })
      .limit(limit)
      .toArray();

    return res.json(docs);
  } catch (err: any) {
    console.error("GET /smoothed error:", err);
    return res.status(500).json({ error: "internal" });
  }
});

// GET /api/v1/transactions/:user_id?start=YYYY-MM-DD&end=YYYY-MM-DD&limit=100
router.get("/transactions/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const limit = Number(req.query.limit || 100);
    const start = req.query.start ? new Date(String(req.query.start)) : new Date(0);
    const end = req.query.end ? new Date(String(req.query.end)) : new Date();

    const db = getDb();

    const docs = await db
      .collection("transactions")
      .find({
        user_id,
        ts: { $gte: start, $lte: end }
      })
      .sort({ ts: -1 })
      .limit(limit)
      .toArray();

    return res.json(docs);
  } catch (err: any) {
    console.error("GET /transactions error:", err);
    return res.status(500).json({ error: "internal" });
  }
});

export default router;
