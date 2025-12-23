import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

/**
 * GET all transactions
 */
// router.get("/", async (req, res) => {
//   try {
//     const { userId } = req.query;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID required" });
//     } 

//     const transactions = await Transaction.find({ userId });
//     res.json(transactions);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId?.toString();

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const transactions = await Transaction.find({
      userId: userId
    });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST – Save transaction to MongoDB
 */
// router.post("/", async (req, res) => {
//   try {
//     if (!req.body.userId) {
//       return res.status(400).json({ message: "User ID required" });
//     }

//     const transaction = new Transaction(req.body);
//     const savedTransaction = await transaction.save();

//     res.status(201).json(savedTransaction);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const transaction = new Transaction({
      ...req.body,
      userId: userId.toString()
    });
    // console.log("Transaction userId:", req.body.userId);


    const saved = await transaction.save();
    res.status(201).json(saved);
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
