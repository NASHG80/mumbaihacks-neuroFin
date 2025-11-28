import { MongoClient, Db } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.MONGO_DB || "neurofin";

let client: MongoClient;
let db: Db;

export async function connect() {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    // indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true }).catch(()=>{});
    await db.collection("transactions").createIndex({ user_id: 1, ts: -1 });
    await db.collection("smoothed_balances").createIndex({ user_id: 1, as_of: -1 });
    console.log("Connected to MongoDB", MONGO_URI, "DB:", DB_NAME);
  }
  return db;
}

export function getDb(): Db {
  if (!db) throw new Error("DB not connected. Call connect() first.");
  return db;
}
