import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

router.post("/message", async (req, res) => {
  try {
    const { user_id, question } = req.body;
    if (!user_id || !question) return res.status(400).json({ error: "missing user_id or question" });

    const AGENT_BASE = process.env.AGENT_URL || "http://agent:6000";
    const url = `${AGENT_BASE}/agent/respond`; // use /agent/respond (recommended)

    // timeout (optional)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000); // 12s

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        user_id,
        question   // send as 'question' for clarity
      }),
    });

    clearTimeout(timeout);

    if (!r.ok) {
      const text = await r.text().catch(() => "");
      console.error("agent error:", r.status, text);
      return res.status(502).json({ error: "agent error", status: r.status, body: text });
    }

    const j = await r.json();
    return res.json(j);

  } catch (e: any) {
    console.error("assistant route error:", e?.message ?? e);
    if (e?.name === "AbortError") return res.status(504).json({ error: "agent timeout" });
    res.status(500).json({ error: "internal" });
  }
});

export default router;
