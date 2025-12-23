import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  description: String,
  amount: Number,
  category: String,
  type: String, // income | expense
  date: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Transaction", transactionSchema);
