import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import ExportButton from '../components/ExportButton'
import { Plus, TrendingUp } from 'lucide-react'

const Income = () => {
  const [showForm, setShowForm] = useState(false)
  const { getIncomeTransactions, getTotalIncome, INCOME_CATEGORIES } = useData()

  const incomeTransactions = getIncomeTransactions()
  const totalIncome = getTotalIncome()

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Income Management</h1>
          <p className="text-gray-600">Track and manage your income sources</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <ExportButton 
            data={incomeTransactions}
            filename="income-report"
            type="income"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-r from-success-50 to-green-50 border-success-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-success-700 mb-1">Total Income</p>
            <p className="text-3xl font-bold text-success-600">
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-sm text-success-600 mt-1">
              {incomeTransactions.length} income {incomeTransactions.length === 1 ? 'source' : 'sources'}
            </p>
          </div>
          <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-success-600" />
          </div>
        </div>
      </div>

      {/* Add Income Form */}
      {showForm && (
        <div className="card animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Income</h2>
          <TransactionForm
            type="income"
            categories={INCOME_CATEGORIES}
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Income List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Income History</h2>
          {incomeTransactions.length > 0 && (
            <span className="text-sm text-gray-500">
              {incomeTransactions.length} {incomeTransactions.length === 1 ? 'entry' : 'entries'}
            </span>
          )}
        </div>
        
        <TransactionList
          transactions={incomeTransactions}
          type="income"
          categories={INCOME_CATEGORIES}
        />
      </div>
    </div>
  )
}

export default Income