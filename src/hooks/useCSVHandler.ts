import { useState, useCallback } from 'react'
import Papa from 'papaparse'
import { AirdropData } from '../types'
import toast from 'react-hot-toast'

export function useCSVHandler() {
  const [csvData, setCsvData] = useState<AirdropData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const parseCSV = useCallback((csvContent: string) => {
    setIsLoading(true)
    
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData: AirdropData[] = results.data.map((row: any) => ({
            address: row.address || row.Address || '',
            amount: row.amount || row.Amount || '0',
          })).filter((item: AirdropData) => item.address && item.amount)

          setCsvData(parsedData)
          toast.success(`Successfully parsed ${parsedData.length} recipients`)
        } catch (error) {
          toast.error('Error parsing CSV data')
          console.error('CSV parsing error:', error)
        } finally {
          setIsLoading(false)
        }
      },
      error: (error) => {
        toast.error('Failed to parse CSV file')
        console.error('Papa parse error:', error)
        setIsLoading(false)
      }
    })
  }, [])

  const importFromFile = useCallback((file: File) => {
    setIsLoading(true)
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData: AirdropData[] = results.data.map((row: any) => ({
            address: row.address || row.Address || '',
            amount: row.amount || row.Amount || '0',
          })).filter((item: AirdropData) => item.address && item.amount)

          setCsvData(parsedData)
          toast.success(`Successfully imported ${parsedData.length} recipients`)
        } catch (error) {
          toast.error('Error importing CSV file')
          console.error('CSV import error:', error)
        } finally {
          setIsLoading(false)
        }
      },
      error: (error) => {
        toast.error('Failed to import CSV file')
        console.error('Papa parse error:', error)
        setIsLoading(false)
      }
    })
  }, [])

  const exportToCSV = useCallback((data: AirdropData[], filename = 'airdrop_data.csv') => {
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('CSV file exported successfully')
    }
  }, [])

  return {
    csvData,
    setCsvData,
    isLoading,
    parseCSV,
    importFromFile,
    exportToCSV,
  }
}