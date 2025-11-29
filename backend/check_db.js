import mongoose from "mongoose";
import dotenv from "dotenv";
import Festival from "./models/Festival.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/neurofin";

console.log("Connecting to:", MONGODB_URI);

mongoose
    .connect(MONGODB_URI)
    .then(async () => {
        console.log("✅ Connected to MongoDB");

        const festivals = await Festival.find({});
        console.log(`Found ${festivals.length} festivals in the database:`);
        console.log(JSON.stringify(festivals, null, 2));

        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Failed to connect to MongoDB", err);
        process.exit(1);
    });
