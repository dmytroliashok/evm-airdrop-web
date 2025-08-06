import React, { useState } from 'react'
import { Trophy, TrendingUp, Users, ChevronDown, ChevronUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { LeaderboardEntry } from '../types'

// Mock data for demonstration
const mockLeaderboardData: LeaderboardEntry[] = [
  {
    walletAddress: '0x1234567890123456789012345678901234567890',
    totalAmountSent: '50000',
    uniqueWalletsReached: 1250,
    tokensSent: [
      { tokenAddress: '0xabc...', tokenSymbol: 'USDT', amount: '30000' },
      { tokenAddress: '0xdef...', tokenSymbol: 'USDC', amount: '20000' },
    ],
    lastActivity: new Date('2025-01-10T10:30:00Z'),
  },
  {
    walletAddress: '0x0987654321098765432109876543210987654321',
    totalAmountSent: '35000',
    uniqueWalletsReached: 890,
    tokensSent: [
      { tokenAddress: '0xghi...', tokenSymbol: 'DAI', amount: '35000' },
    ],
    lastActivity: new Date('2025-01-09T15:45:00Z'),
  },
  {
    walletAddress: '0x1111222233334444555566667777888899990000',
    totalAmountSent: '28000',
    uniqueWalletsReached: 1100,
    tokensSent: [
      { tokenAddress: '0xjkl...', tokenSymbol: 'WETH', amount: '15000' },
      { tokenAddress: '0xmno...', tokenSymbol: 'LINK', amount: '13000' },
    ],
    lastActivity: new Date('2025-01-08T09:15:00Z'),
  },
  {
    walletAddress: '0x2222333344445555666677778888999900001111',
    totalAmountSent: '42000',
    uniqueWalletsReached: 750,
    tokensSent: [
      { tokenAddress: '0xpqr...', tokenSymbol: 'UNI', amount: '25000' },
      { tokenAddress: '0xstu...', tokenSymbol: 'AAVE', amount: '17000' },
    ],
    lastActivity: new Date('2025-01-11T14:20:00Z'),
  },
  {
    walletAddress: '0x3333444455556666777788889999000011112222',
    totalAmountSent: '18500',
    uniqueWalletsReached: 2100,
    tokensSent: [
      { tokenAddress: '0xvwx...', tokenSymbol: 'MATIC', amount: '18500' },
    ],
    lastActivity: new Date('2025-01-07T11:45:00Z'),
  },
]

type TimeFilter = 'all-time' | '7-days' | '24-hours'
type SortField = 'rank' | 'wallet' | 'totalAmount' | 'uniqueWallets' | 'lastActivity'
type SortDirection = 'asc' | 'desc'

export function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all-time')
  const [sortField, setSortField] = useState<SortField>('totalAmount')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedData = [...mockLeaderboardData].sort((a, b) => {
    let comparison = 0
    
    switch (sortField) {
      case 'totalAmount':
        comparison = parseFloat(a.totalAmountSent) - parseFloat(b.totalAmountSent)
        break
      case 'uniqueWallets':
        comparison = a.uniqueWalletsReached - b.uniqueWalletsReached
        break
      case 'wallet':
        comparison = a.walletAddress.localeCompare(b.walletAddress)
        break
      case 'lastActivity':
        comparison = a.lastActivity.getTime() - b.lastActivity.getTime()
        break
      default:
        comparison = parseFloat(a.totalAmountSent) - parseFloat(b.totalAmountSent)
    }
    
    return sortDirection === 'asc' ? comparison : -comparison
  })

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = sortedData.slice(startIndex, endIndex)

  // Reset to first page when sorting or filtering changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [sortField, sortDirection, timeFilter])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-500" />
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-400" />
      : <ChevronDown className="w-4 h-4 text-blue-400" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Leaderboard
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-300">Show:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <label className="text-sm font-medium text-gray-300">Time Period:</label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
          >
            <option value="all-time">All Time</option>
            <option value="7-days">Last 7 Days</option>
            <option value="24-hours">Last 24 Hours</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                <button
                  onClick={() => handleSort('rank')}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  Rank
                  {getSortIcon('rank')}
                </button>
              </th>
              <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                <button
                  onClick={() => handleSort('wallet')}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  Wallet Address
                  {getSortIcon('wallet')}
                </button>
              </th>
              <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                <button
                  onClick={() => handleSort('totalAmount')}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Total Amount
                  {getSortIcon('totalAmount')}
                </button>
              </th>
              <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                <button
                  onClick={() => handleSort('uniqueWallets')}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Users className="w-4 h-4 text-blue-400" />
                  Wallets Reached
                  {getSortIcon('uniqueWallets')}
                </button>
              </th>
              <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                Tokens Sent
              </th>
              <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                <button
                  onClick={() => handleSort('lastActivity')}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  Last Activity
                  {getSortIcon('lastActivity')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((entry, index) => (
              <motion.tr
                key={entry.walletAddress}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-black font-bold text-sm">
                    {startIndex + index + 1}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-white font-mono text-sm">
                    {entry.walletAddress.slice(0, 8)}...{entry.walletAddress.slice(-6)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-white font-semibold text-lg">
                    ${parseFloat(entry.totalAmountSent).toLocaleString()}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-white font-semibold text-lg">
                    {entry.uniqueWalletsReached.toLocaleString()}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    {entry.tokensSent.slice(0, 2).map((token, tokenIndex) => (
                      <div key={tokenIndex} className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-200">
                          {token.tokenSymbol}
                        </span>
                        <span className="text-gray-300 text-sm">
                          ${parseFloat(token.amount).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {entry.tokensSent.length > 2 && (
                      <div className="text-gray-400 text-xs">
                        +{entry.tokensSent.length - 2} more
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-300 text-sm">
                    {entry.lastActivity.toLocaleDateString()}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {entry.lastActivity.toLocaleTimeString()}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} entries
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current page
                const showPage = 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                
                if (!showPage) {
                  // Show ellipsis for gaps
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    )
                  }
                  return null
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {paginatedData.length === 0 && sortedData.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No leaderboard data available</p>
          <p className="text-sm">Complete an airdrop to appear on the leaderboard</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Total Participants</div>
            <div className="text-white font-semibold text-xl">{sortedData.length}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Total Volume</div>
            <div className="text-white font-semibold text-xl">
              ${sortedData.reduce((sum, entry) => sum + parseFloat(entry.totalAmountSent), 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Total Wallets Reached</div>
            <div className="text-white font-semibold text-xl">
              {sortedData.reduce((sum, entry) => sum + entry.uniqueWalletsReached, 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}