import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { Download } from 'lucide-react'
import { format } from 'date-fns'

const ExportButton = ({ data, filename, type }) => {
  const [exporting, setExporting] = useState(false)

  const exportToExcel = async () => {
    if (!data || data.length === 0) {
      alert('No data to export')
      return
    }

    setExporting(true)

    try {
      // Prepare data for Excel export
      const exportData = data.map((item, index) => ({
        'S.No': index + 1,
        'Description': item.description,
        'Amount': parseFloat(item.amount),
        'Category': item.category || 'N/A',
        'Date': format(new Date(item.date || item.createdAt), 'yyyy-MM-dd'),
        'Created At': format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm:ss')
      }))

      // Add summary row
      const totalAmount = data.reduce((sum, item) => sum + parseFloat(item.amount), 0)
      exportData.push({
        'S.No': '',
        'Description': 'TOTAL',
        'Amount': totalAmount,
        'Category': '',
        'Date': '',
        'Created At': ''
      })

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Set column widths
      const colWidths = [
        { wch: 8 },  // S.No
        { wch: 30 }, // Description
        { wch: 12 }, // Amount
        { wch: 20 }, // Category
        { wch: 12 }, // Date
        { wch: 20 }  // Created At
      ]
      ws['!cols'] = colWidths

      // Style the total row
      const totalRowIndex = exportData.length
      const totalCell = `B${totalRowIndex}`
      if (ws[totalCell]) {
        ws[totalCell].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "FFFFE0" } }
        }
      }

      // Add worksheet to workbook
      const sheetName = type === 'income' ? 'Income Report' : 'Expense Report'
      XLSX.utils.book_append_sheet(wb, ws, sheetName)

      // Generate filename with timestamp
      const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm')
      const fileName = `${filename}-${timestamp}.xlsx`

      // Save file
      XLSX.writeFile(wb, fileName)

    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export data. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      onClick={exportToExcel}
      disabled={exporting || !data || data.length === 0}
      className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      title={`Export ${type} data to Excel`}
    >
      <Download className="w-4 h-4" />
      <span>{exporting ? 'Exporting...' : 'Export Excel'}</span>
    </button>
  )
}

export default ExportButton