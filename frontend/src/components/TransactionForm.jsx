import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import LoadingSpinner from './LoadingSpinner'
import { Calendar, DollarSign, FileText, Tag } from 'lucide-react'

const TransactionForm = ({ type, categories, onSuccess, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    amount: initialData?.amount || '',
    category: initialData?.category || categories[0] || '',
    date: initialData?.date || new Date().toISOString().split('T')[0]
  })
  const [errors, setErrors] = useState({})
  const { addTransaction, updateTransaction, loading } = useData()

  const isEditing = !!initialData

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const transactionData = {
      ...formData,
      type,
      amount: parseFloat(formData.amount)
    }

    let result
    if (isEditing) {
      result = await updateTransaction(initialData.id, transactionData)
    } else {
      result = await addTransaction(transactionData)
    }

    if (result.success) {
      onSuccess?.()
      if (!isEditing) {
        // Reset form for new transactions
        setFormData({
          description: '',
          amount: '',
          category: categories[0] || '',
          date: new Date().toISOString().split('T')[0]
        })
      }
    } else {
      setErrors({ general: result.error })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              className={`
                input-field pl-10
                ${errors.description ? 'border-red-300 focus:ring-red-500' : ''}
              `}
              placeholder={`Enter ${type} description`}
            />
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              className={`
                input-field pl-10
                ${errors.amount ? 'border-red-300 focus:ring-red-500' : ''}
              `}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`
                input-field pl-10
                ${errors.category ? 'border-red-300 focus:ring-red-500' : ''}
              `}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Date */}
        <div className="md:col-span-2">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={`
                input-field pl-10
                ${errors.date ? 'border-red-300 focus:ring-red-500' : ''}
              `}
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary w-full sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <LoadingSpinner size="sm" />}
          <span>{isEditing ? 'Update' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}</span>
        </button>
      </div>
    </form>
  )
}

export default TransactionForm