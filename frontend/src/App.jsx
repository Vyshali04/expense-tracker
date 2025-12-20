import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Income from './pages/Income'
import Expenses from './pages/Expenses'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  useEffect(() => {
    // Console logging setup for iframe communication
    ["log", "warn", "error"].forEach((level) => {
      const original = console[level];

      console[level] = (...args) => {
        original.apply(console, args);

        const safeArgs = args.map((a) => {
          if (a instanceof Error) {
            return {
              message: a.message,
              stack: a.stack,
              name: a.name,
            };
          }
          try {
            JSON.stringify(a);
            return a;
          } catch {
            return String(a);
          }
        });

        try {
          window.parent?.postMessage(
            { type: "iframe-console", level, args: safeArgs },
            "*"
          );
        } catch (e) {
          original("Failed to postMessage:", e);
        }
      };
    });

    // Global error handler
    window.onerror = (msg, url, line, col, error) => {
      window.parent?.postMessage(
        {
          type: "iframe-console",
          level: "error",
          args: [
            msg,
            url,
            line,
            col,
            error ? { message: error.message, stack: error.stack } : null,
          ],
        },
        "*"
      );
    };

    // Unhandled promise rejections
    window.onunhandledrejection = (event) => {
      const reason =
        event.reason instanceof Error
          ? { message: event.reason.message, stack: event.reason.stack }
          : event.reason;

      window.parent?.postMessage(
        {
          type: "iframe-console",
          level: "error",
          args: ["Unhandled Promise Rejection:", reason],
        },
        "*"
      );
    };
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="income" element={<Income />} />
                  <Route path="expenses" element={<Expenses />} />
                </Route>
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App