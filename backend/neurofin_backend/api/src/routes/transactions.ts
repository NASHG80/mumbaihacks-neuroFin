import { Router } from "express";
import { CanonicalTransaction } from "../types";
import Redis from "ioredis";
import { getDb } from "../db";

const router = Router();
const redis = new Redis({ host: process.env.REDIS_HOST || "127.0.0.1", port: Number(process.env.REDIS_PORT || 6379) });

router.post("/batch", async (req, res) => {
  try {
    const body = req.body;
    if (!body || !Array.isArray(body.transactions)) {
      return res.status(400).json({ error: "missing transactions array" });
    }

    const txs: CanonicalTransaction[] = body.transactions;

    for (const tx of txs) {
      if (!tx.user_id || !tx.timestamp || typeof tx.amount !== "number" || !tx.direction) {
        return res.status(400).json({ error: "invalid transaction schema" });
      }
    }

    const db = getDb();
    const coll = db.collection("transactions");

    const docs = txs.map(tx => ({
      user_id: tx.user_id,
      account_id: tx.account_id || null,
      ts: new Date(tx.timestamp),
      amount: tx.amount,
      direction: tx.direction,
      merchant: tx.merchant || null,
      category: tx.category || null,
      currency: tx.currency || 'INR',
      raw_payload: tx.raw || null,
      created_at: new Date()
    }));

    const insertRes = await coll.insertMany(docs);

    for (const doc of docs) {
      const payload = {
        user_id: doc.user_id,
        ts: doc.ts.toISOString(),
        amount: doc.amount,
        direction: doc.direction
      };
      await redis.rpush("transactions_queue", JSON.stringify(payload));
    }

    return res.status(202).json({ status: "queued", count: docs.length, insertedCount: insertRes.insertedCount });
  } catch (err: any) {
    console.error("ingest error", err);
    return res.status(500).json({ error: "internal" });
  }
});

export default router;
