import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// 🔹 Categories
const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Rental",
  "Gift",
  "Other",
];

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Housing",
  "Insurance",
  "Other",
];

// 🔹 Backend API
const API_URL = "http://localhost:5000/api";

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Load transactions when user logs in
  useEffect(() => {
    if (user) {
      loadTransactions();
    } else {
      setTransactions([]);
    }
  }, [user]);

  // ========================
  // API FUNCTIONS
  // ========================

  const loadTransactions = async () => {
    if (!user) return;

    try {
      const res = await axios.get(`${API_URL}/transactions`);
      const userTransactions = res.data.filter(
        (t) => t.userId === user.id
      );
      setTransactions(userTransactions);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const addTransaction = async (transactionData) => {
    if (!user) return { success: false, error: "User not authenticated" };

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/transactions`, {
        userId: user.id,
        ...transactionData,
      });

      setTransactions((prev) => [...prev, res.data]);
      setLoading(false);

      return { success: true, transaction: res.data };
    } catch (error) {
      console.error("Add transaction error:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const updateTransaction = async (id, updates) => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/transactions/${id}`, updates);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Update error:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const deleteTransaction = async (id) => {
  setLoading(true);
  try {
    await axios.delete(`${API_URL}/transactions/${id}`);

    // ✅ FIX: use _id instead of id
    setTransactions((prev) =>
      prev.filter((t) => t._id !== id)
    );

    setLoading(false);
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    setLoading(false);
    return { success: false, error: error.message };
  }
};

  // ========================
  // CALCULATIONS
  // ========================

  const getIncomeTransactions = () =>
    transactions.filter((t) => t.type === "income");

  const getExpenseTransactions = () =>
    transactions.filter((t) => t.type === "expense");

  const getTotalIncome = () =>
    getIncomeTransactions().reduce(
      (total, t) => total + Number(t.amount),
      0
    );

  const getTotalExpenses = () =>
    getExpenseTransactions().reduce(
      (total, t) => total + Number(t.amount),
      0
    );

  const getBalance = () => getTotalIncome() - getTotalExpenses();

  const getRecentTransactions = (limit = 10) =>
    [...transactions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

  const getExpensesByCategory = () => {
    const totals = {};
    getExpenseTransactions().forEach((t) => {
      const category = t.category || "Other";
      totals[category] = (totals[category] || 0) + Number(t.amount);
    });
    return totals;
  };

  const getMonthlyData = () => {
    const monthly = {};

    transactions.forEach((t) => {
      const date = new Date(t.date || t.createdAt);
      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthly[key]) {
        monthly[key] = { income: 0, expense: 0 };
      }

      if (t.type === "income") {
        monthly[key].income += Number(t.amount);
      } else {
        monthly[key].expense += Number(t.amount);
      }
    });

    return monthly;
  };

  // ========================
  // PROVIDER VALUE
  // ========================

  const value = {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getIncomeTransactions,
    getExpenseTransactions,
    getTotalIncome,
    getTotalExpenses,
    getBalance,
    getRecentTransactions,
    getExpensesByCategory,
    getMonthlyData,
    INCOME_CATEGORIES,
    EXPENSE_CATEGORIES,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
