import React from 'react'
import { useData } from '../contexts/DataContext'
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

const RecentTransactions = () => {
  const { getRecentTransactions, deleteTransaction, loading } = useData()
  const recentTransactions = getRecentTransactions(8)

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (recentTransactions.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Yet</h3>
        <p className="text-gray-600">Start by adding your first income or expense transaction</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
        <span className="text-sm text-gray-500">{recentTransactions.length} transactions</span>
      </div>

      <div className="space-y-3">
        {recentTransactions.map((transaction) => {
          const isIncome = transaction.type === 'income'
          const Icon = isIncome ? TrendingUp : TrendingDown
          
          return (
            <div
              key={transaction.id}
              className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isIncome ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    {transaction.category && (
                      <>
                        <span>{transaction.category}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>
                      {format(new Date(transaction.date || transaction.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`font-bold ${isIncome ? 'text-success-600' : 'text-danger-600'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
                
                <button
                  onClick={() => handleDelete(transaction.id)}
                  disabled={loading}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                  title="Delete transaction"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentTransactions