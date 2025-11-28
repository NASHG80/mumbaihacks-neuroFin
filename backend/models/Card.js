import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
  number: String,
  holder: String,
  expiry: String,
  brand: String,
  bank: String,
  logoUrl: String,
  userId: String, // Link to logged in user
}, { timestamps: true });

export default mongoose.models.Card || mongoose.model("Card", CardSchema);
