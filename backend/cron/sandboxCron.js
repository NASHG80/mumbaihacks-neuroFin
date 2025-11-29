import cron from "node-cron";
import Card from "../models/Card.js";
import SandboxTransaction from "../models/SandboxTransaction.js";
import generateTransactions from "../utils/generateTransactions.js";

async function runSandboxCronTick() {
  console.log("⚡ Sandbox Tick Running");

  try {
    const cards = await Card.find({});
    console.log("Cards found:", cards.length);

    for (const c of cards) {
      const cardNumber = c.number.replace(/\s+/g, "");
      const bank = c.bank;
      const cardId = c._id;

      // Check if this card already has transactions
      const existing = await SandboxTransaction.findOne({ cardNumber });

      // FIRST RUN → 200 (spread across 1 year)
      // LATER → 10 (cluster near now)
      const txnCount = existing ? 10 : 200;

      const generated = generateTransactions(
        cardNumber,
        txnCount,
        bank,
        existing
          ? { anchorNow: true }
          : { spreadOverYear: true }
      );

      // Save each transaction as a separate document
      for (const { monthKey, transaction } of generated) {
        await SandboxTransaction.create({
          ...transaction,

          // 🔥 KEY FIX — Python-safe timestamp format
          timestamp: transaction.timestamp.toISOString(),

          card: cardId,
          bank,
          cardNumber,
          month: monthKey,
          createdAt: new Date()
        });
      }

      console.log(`💾 Inserted ${txnCount} separate txns → ${cardNumber}`);
    }

    console.log("✅ Tick Complete");
  } catch (err) {
    console.error("❌ Cron Tick Error:", err);
  }
}

export default function startSandboxCron() {
  console.log("⏳ Sandbox Cron Enabled");

  // Run immediately
  runSandboxCronTick();

  // Run every 30 minutes
  cron.schedule("*/30 * * * *", runSandboxCronTick);
}
