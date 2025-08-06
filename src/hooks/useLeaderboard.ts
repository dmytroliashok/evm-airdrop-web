import { useState, useEffect } from 'react'
import { LeaderboardEntry } from '../types'
import toast from 'react-hot-toast'

interface LeaderboardResponse {
  data: LeaderboardEntry[]
  total: number
  page: number
  limit: number
}

interface UseLeaderboardOptions {
  page?: number
  limit?: number
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  timeFilter?: string
}

export function useLeaderboard(options: UseLeaderboardOptions = {}) {
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const {
    page = 1,
    limit = 10,
    sortField = 'totalAmountSent',
    sortDirection = 'desc',
    timeFilter = 'all-time'
  } = options

  const fetchLeaderboard = async () => {
    setLoading(true)
    setError(null)

    try {
      // Replace with your actual API endpoint
      const apiUrl = process.env.VITE_API_URL || 'http://localhost:3001'
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortField,
        sortDirection,
        timeFilter
      })

      const response = await fetch(`${apiUrl}/api/leaderboard?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: LeaderboardResponse = await response.json()
      
      // Convert date strings to Date objects
      const processedData = result.data.map(entry => ({
        ...entry,
        lastActivity: new Date(entry.lastActivity)
      }))

      setData(processedData)
      setTotal(result.total)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch leaderboard data'
      setError(errorMessage)
      toast.error(errorMessage)
      
      // Fallback to mock data for development
      setData(getMockData())
      setTotal(getMockData().length)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [page, limit, sortField, sortDirection, timeFilter])

  const refetch = () => {
    fetchLeaderboard()
  }

  return {
    data,
    loading,
    error,
    total,
    refetch
  }
}

// Mock data for development/fallback
function getMockData(): LeaderboardEntry[] {
  return [
    {
      walletAddress: '0x1234567890123456789012345678901234567890',
      totalAmountSent: '50000',
      walletsReached: 1250,
      tokenAddress: '0xA0b86a33E6441c8C06DD2b7c94b7E0e8c0c8e8e8',
      tokenSymbol: 'USDT',
      lastActivity: new Date('2025-01-10T10:30:00Z'),
    },
    {
      walletAddress: '0x0987654321098765432109876543210987654321',
      totalAmountSent: '35000',
      walletsReached: 890,
      tokenAddress: '0xB1c97a44F7551c9C17EE3b8c95b8F9f9d1d9f9f9',
      tokenSymbol: 'USDC',
      lastActivity: new Date('2025-01-09T15:45:00Z'),
    },
    {
      walletAddress: '0x1111222233334444555566667777888899990000',
      totalAmountSent: '28000',
      walletsReached: 1100,
      tokenAddress: '0xC2d08b55G8662d0D28FF4c9c96c9G0G0e2e0G0G0',
      tokenSymbol: 'WETH',
      lastActivity: new Date('2025-01-08T09:15:00Z'),
    },
    {
      walletAddress: '0x2222333344445555666677778888999900001111',
      totalAmountSent: '42000',
      walletsReached: 750,
      tokenAddress: '0xD3e19c66H9773e1E39GG5d0d07d0H1H1f3f1H1H1',
      tokenSymbol: 'UNI',
      lastActivity: new Date('2025-01-11T14:20:00Z'),
    },
    {
      walletAddress: '0x3333444455556666777788889999000011112222',
      totalAmountSent: '18500',
      walletsReached: 2100,
      tokenAddress: '0xE4f20d77I0884f2F40HH6e1e18e1I2I2g4g2I2I2',
      tokenSymbol: 'MATIC',
      lastActivity: new Date('2025-01-07T11:45:00Z'),
    },
  ]
}