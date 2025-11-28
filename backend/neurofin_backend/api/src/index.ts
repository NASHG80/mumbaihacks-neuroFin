import express from "express";
import bodyParser from "body-parser";
import transactionsRouter from "./routes/transactions";
import { connect } from "./db";
import readRouter from "./routes/read";
import assistantRouter from "./routes/assistant";



const app = express();
app.use(bodyParser.json());

// Mount routers
app.use("/api/v1/transactions", transactionsRouter);
app.use("/api/v1", readRouter); // <-- mounted the read router
app.use("/api/v1/assistant", assistantRouter);

const port = Number(process.env.PORT || 4000);

connect().then(() => {
  app.listen(port, () => {
    console.log(`neurofin api listening on ${port}`);
  });
}).catch(err => {
  console.error("Failed to connect to DB", err);
  process.exit(1);
});
