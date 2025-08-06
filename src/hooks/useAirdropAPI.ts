import { useState } from 'react'
import { AirdropData, AirdropTransaction } from '../types'
import toast from 'react-hot-toast'

interface SaveAirdropRequest {
  fromAddress: string
  tokenAddress: string
  tokenSymbol: string
  recipients: AirdropData[]
  totalAmount: string
  txHash: string
}

interface SaveAirdropResponse {
  success: boolean
  data?: AirdropTransaction
  error?: string
}

export function useAirdropAPI() {
  const [isSaving, setIsSaving] = useState(false)

  const saveAirdropData = async (airdropData: SaveAirdropRequest): Promise<SaveAirdropResponse> => {
    setIsSaving(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      
      const response = await fetch(`${apiUrl}/api/airdrops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...airdropData,
          timestamp: new Date().toISOString(),
          totalRecipients: airdropData.recipients.length,
          status: 'completed'
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: SaveAirdropResponse = await response.json()
      
      if (result.success) {
        toast.success('Airdrop data saved successfully!')
        return result
      } else {
        throw new Error(result.error || 'Failed to save airdrop data')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save airdrop data'
      toast.error(`Error saving airdrop: ${errorMessage}`)
      console.error('Save airdrop error:', error)
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsSaving(false)
    }
  }

  const updateAirdropStatus = async (txHash: string, status: 'completed' | 'failed'): Promise<boolean> => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      
      const response = await fetch(`${apiUrl}/api/airdrops/${txHash}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('Update airdrop status error:', error)
      return false
    }
  }

  const getAirdropHistory = async (walletAddress: string): Promise<AirdropTransaction[]> => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      
      const response = await fetch(`${apiUrl}/api/airdrops/history/${walletAddress}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Convert date strings to Date objects
      return result.data.map((transaction: any) => ({
        ...transaction,
        timestamp: new Date(transaction.timestamp)
      }))
    } catch (error) {
      console.error('Get airdrop history error:', error)
      return []
    }
  }

  return {
    saveAirdropData,
    updateAirdropStatus,
    getAirdropHistory,
    isSaving
  }
}