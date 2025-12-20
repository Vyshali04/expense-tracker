import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

//const API_URL = "http://localhost:5000/api/auth";
const API_URL = "https://expense-tracker-xzkx.onrender.com/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("expense_tracker_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // REGISTER → MongoDB
  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Auto-login after register
      setUser(data.user);
      localStorage.setItem(
        "expense_tracker_user",
        JSON.stringify(data.user)
      );

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // LOGIN → MongoDB (read only)
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUser(data.user);
      localStorage.setItem(
        "expense_tracker_user",
        JSON.stringify(data.user)
      );

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("expense_tracker_user");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
