import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useData } from '../../contexts/DataContext'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const MonthlyTrendChart = () => {
  const { getMonthlyData } = useData()

  const monthlyData = getMonthlyData()
  const months = Object.keys(monthlyData).sort()

  if (months.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">No monthly data available</p>
      </div>
    )
  }

  const incomeData = months.map(month => monthlyData[month].income)
  const expenseData = months.map(month => monthlyData[month].expense)
  
  // Format month labels
  const labels = months.map(month => {
    const [year, monthNum] = month.split('-')
    const date = new Date(year, monthNum - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  })

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
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
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString()
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  }

  return (
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  )
}

export default MonthlyTrendChart