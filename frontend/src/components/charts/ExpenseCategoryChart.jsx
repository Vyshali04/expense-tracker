import React from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { useData } from '../../contexts/DataContext'

ChartJS.register(ArcElement, Tooltip, Legend)

const ExpenseCategoryChart = () => {
  const { getExpensesByCategory } = useData()

  const categoryData = getExpensesByCategory()
  const categories = Object.keys(categoryData)
  const values = Object.values(categoryData)

  if (categories.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">No expense data available</p>
      </div>
    )
  }

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280'
  ]

  const data = {
    labels: categories,
    datasets: [
      {
        data: values,
        backgroundColor: colors.slice(0, categories.length),
        borderColor: colors.slice(0, categories.length),
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return `${context.label}: $${context.parsed.toLocaleString()} (${percentage}%)`
          }
        }
      },
    },
    cutout: '60%',
  }

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  )
}

export default ExpenseCategoryChart