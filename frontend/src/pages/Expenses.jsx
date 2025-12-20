import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import ExportButton from '../components/ExportButton'
import { Plus, TrendingDown } from 'lucide-react'

const Expenses = () => {
  const [showForm, setShowForm] = useState(false)
  const { getExpenseTransactions, getTotalExpenses, EXPENSE_CATEGORIES } = useData()

  const expenseTransactions = getExpenseTransactions()
  const totalExpenses = getTotalExpenses()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Management</h1>
          <p className="text-gray-600">Track and categorize your expenses</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <ExportButton 
            data={expenseTransactions}
            filename="expense-report"
            type="expense"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-r from-danger-50 to-red-50 border-danger-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-danger-700 mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-danger-600">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-sm text-danger-600 mt-1">
              {expenseTransactions.length} {expenseTransactions.length === 1 ? 'expense' : 'expenses'}
            </p>
          </div>
          <div className="w-16 h-16 bg-danger-100 rounded-2xl flex items-center justify-center">
            <TrendingDown className="w-8 h-8 text-danger-600" />
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <div className="card animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Expense</h2>
          <TransactionForm
            type="expense"
            categories={EXPENSE_CATEGORIES}
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Expense List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Expense History</h2>
          {expenseTransactions.length > 0 && (
            <span className="text-sm text-gray-500">
              {expenseTransactions.length} {expenseTransactions.length === 1 ? 'entry' : 'entries'}
            </span>
          )}
        </div>
        
        <TransactionList
          transactions={expenseTransactions}
          type="expense"
          categories={EXPENSE_CATEGORIES}
        />
      </div>
    </div>
  )
}

export default Expenses