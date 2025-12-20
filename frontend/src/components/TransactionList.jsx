import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import TransactionForm from './TransactionForm'
import { Trash2, Edit3, Search, Filter } from 'lucide-react'
import { format } from 'date-fns'

const TransactionList = ({ transactions, type, categories }) => {
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const { deleteTransaction, loading } = useData()

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id)
    }
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
  }

  const handleEditSuccess = () => {
    setEditingTransaction(null)
  }

  const handleEditCancel = () => {
    setEditingTransaction(null)
  }

  // Filter transactions based on search term and category
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === '' || transaction.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No {type} transactions yet
        </h3>
        <p className="text-gray-600">
          Start by adding your first {type} transaction using the form above
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="relative sm:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field pl-10"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Edit Form */}
      {editingTransaction && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Edit {type === 'income' ? 'Income' : 'Expense'}
          </h3>
          <TransactionForm
            type={type}
            categories={categories}
            initialData={editingTransaction}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        </div>
      )}

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions match your search criteria</p>
          </div>
        ) : (
          filteredTransactions
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((transaction) => (
              <div
                key={transaction._id}
                className="group flex items-center justify-between p-4 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm rounded-xl transition-all duration-200"
              >
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                          {transaction.category}
                        </span>
                        <span>•</span>
                        <span>
                          {format(new Date(transaction.date || transaction.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`font-bold text-lg ${
                        type === 'income' ? 'text-success-600' : 'text-danger-600'
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </span>
                      
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Edit transaction"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          disabled={loading}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Results Summary */}
      {filteredTransactions.length > 0 && (
        <div className="text-sm text-gray-500 text-center pt-4 border-t border-gray-200">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      )}
    </div>
  )
}

export default TransactionList