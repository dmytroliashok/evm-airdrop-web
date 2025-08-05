import React, { useRef } from 'react'
import { Upload, Download, FileText, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCSVHandler } from '../hooks/useCSVHandler'
import { AirdropData } from '../types'

interface CSVHandlerProps {
  onDataChange: (data: AirdropData[]) => void
}

export function CSVHandler({ onDataChange }: CSVHandlerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { csvData, setCsvData, isLoading, importFromFile, exportToCSV } = useCSVHandler()

  React.useEffect(() => {
    onDataChange(csvData)
  }, [csvData, onDataChange])

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      importFromFile(file)
    }
  }

  const addManualEntry = () => {
    setCsvData([...csvData, { address: '', amount: '' }])
  }

  const updateEntry = (index: number, field: keyof AirdropData, value: string) => {
    const newData = [...csvData]
    newData[index][field] = value
    setCsvData(newData)
  }

  const removeEntry = (index: number) => {
    setCsvData(csvData.filter((_, i) => i !== index))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
    >
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-purple-400" />
        Airdrop Recipients
      </h2>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
          Import CSV
        </button>
        
        <button
          onClick={() => exportToCSV(csvData)}
          disabled={csvData.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        
        <button
          onClick={addManualEntry}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Recipient
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileImport}
        className="hidden"
      />

      {csvData.length > 0 && (
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-300 mb-2">
              Total Recipients: <span className="text-white font-semibold">{csvData.length}</span>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-3">
              <AnimatePresence>
                {csvData.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-gray-600 rounded-lg"
                  >
                    <input
                      type="text"
                      placeholder="Recipient Address"
                      value={entry.address}
                      onChange={(e) => updateEntry(index, 'address', e.target.value)}
                      className="md:col-span-2 px-3 py-2 bg-gray-500 border border-gray-400 rounded-md text-white placeholder-gray-300 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    />
                    
                    <input
                      type="text"
                      placeholder="Amount"
                      value={entry.amount}
                      onChange={(e) => updateEntry(index, 'amount', e.target.value)}
                      className="md:col-span-2 px-3 py-2 bg-gray-500 border border-gray-400 rounded-md text-white placeholder-gray-300 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    />
                    
                    <button
                      onClick={() => removeEntry(index)}
                      className="md:col-span-1 flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {csvData.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No recipients added yet</p>
          <p className="text-sm">Import a CSV file or add recipients manually</p>
        </div>
      )}
    </motion.div>
  )
}