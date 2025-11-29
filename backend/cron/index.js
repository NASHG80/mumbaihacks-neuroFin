import cron from "node-cron";
import { sandboxCronTick } from "./sandboxCron.js";
import cron from "node-cron"
import runInsightCron from "./insightsCron.js"

cron.schedule("0 */6 * * *", runInsightCron) // every 6 hours

console.log("⏰ Sandbox Cron Ready!");

cron.schedule("*/30 * * * *", async () => {
  await sandboxCronTick();
});
