import React from 'react'
import { useData } from '../contexts/DataContext'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const SummaryCards = () => {
  const { getTotalIncome, getTotalExpenses, getBalance } = useData()

  const totalIncome = getTotalIncome()
  const totalExpenses = getTotalExpenses()
  const balance = getBalance()

  const cards = [
    {
      title: 'Total Balance',
      value: balance,
      icon: DollarSign,
      color: balance >= 0 ? 'text-success-600' : 'text-danger-600',
      bgColor: balance >= 0 ? 'bg-success-50' : 'bg-danger-50',
      change: null
    },
    {
      title: 'Total Income',
      value: totalIncome,
      icon: TrendingUp,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      change: '+12.5%'
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: TrendingDown,
      color: 'text-danger-600',
      bgColor: 'bg-danger-50',
      change: '+8.2%'
    }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className="card hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {formatCurrency(card.value)}
                </p>
                {card.change && (
                  <p className="text-xs text-gray-500 mt-1">
                    {card.change} from last month
                  </p>
                )}
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SummaryCards