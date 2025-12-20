import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

/**
 * GET all transactions
 */
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST – Save transaction to MongoDB
 */
router.post("/", async (req, res) => {
  try {
    console.log("Saving to MongoDB:", req.body);

    const transaction = new Transaction(req.body);
    const savedTransaction = await transaction.save();

    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE transaction
 */
router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
