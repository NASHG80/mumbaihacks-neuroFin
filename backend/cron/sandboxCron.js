import cron from "node-cron";
import Card from "../models/Card.js";
import SandboxMonthlyTransaction from "../models/SandboxCardTransaction.js";
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

      let existing = await SandboxMonthlyTransaction.findOne({ cardNumber });

      const txnCount = existing ? 10 : 100;
      const generated = generateTransactions(cardNumber, txnCount, bank);

      for (const { monthKey, transaction } of generated) {
        await SandboxMonthlyTransaction.findOneAndUpdate(
          { cardNumber },
          {
            $push: { [`months.${monthKey}`]: transaction },
            updatedAt: new Date(),
            card: cardId,
            bank
          },
          { upsert: true }
        );
      }

      console.log(`💾 Added ${txnCount} txns → ${cardNumber}`);
    }

    console.log("✅ Tick Complete");
  } catch (err) {
    console.error("❌ Cron Tick Error:", err);
  }
}

export default function startSandboxCron() {
  console.log("⏳ Sandbox Cron Enabled");

  // ⭐ Run Immediately
  runSandboxCronTick();

  // ⭐ Schedule Every 30 min
  cron.schedule("*/30 * * * *", runSandboxCronTick);
}