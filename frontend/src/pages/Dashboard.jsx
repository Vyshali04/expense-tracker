import React from 'react'
import { useData } from '../contexts/DataContext'
import SummaryCards from '../components/SummaryCards'
import ChartsSection from '../components/ChartsSection'
import RecentTransactions from '../components/RecentTransactions'

const Dashboard = () => {
  const { loading } = useData()

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Get an overview of your financial status</p>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Section */}
      <ChartsSection />

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  )
}

export default Dashboard