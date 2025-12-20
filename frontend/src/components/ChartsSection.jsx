import React from 'react'
import { useData } from '../contexts/DataContext'
import IncomeExpenseChart from './charts/IncomeExpenseChart'
import ExpenseCategoryChart from './charts/ExpenseCategoryChart'
import MonthlyTrendChart from './charts/MonthlyTrendChart'

const ChartsSection = () => {
  const { getIncomeTransactions, getExpenseTransactions } = useData()

  const hasData = getIncomeTransactions().length > 0 || getExpenseTransactions().length > 0

  if (!hasData) {
    return (
      <div className="card text-center py-12">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-600">Add some income and expense transactions to see charts</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Analytics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Income vs Expenses Bar Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses</h3>
            <IncomeExpenseChart />
          </div>

          {/* Expense Categories Pie Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
            <ExpenseCategoryChart />
          </div>
        </div>

        {/* Monthly Trend Line Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <MonthlyTrendChart />
        </div>
      </div>
    </div>
  )
}

export default ChartsSection