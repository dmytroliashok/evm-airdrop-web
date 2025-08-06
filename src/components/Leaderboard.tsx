import React, { useState } from 'react'
import { Trophy, TrendingUp, Users, ChevronDown, ChevronUp, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLeaderboard } from '../hooks/useLeaderboard'

type TimeFilter = 'all-time' | '7-days' | '24-hours'
type SortField = 'walletAddress' | 'totalAmountSent' | 'walletsReached' | 'tokenAddress' | 'tokenSymbol' | 'lastActivity'
type SortDirection = 'asc' | 'desc'

export function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all-time')
  const [sortField, setSortField] = useState<SortField>('totalAmountSent')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { data, loading, error, total, refetch } = useLeaderboard({
    page: currentPage,
    limit: itemsPerPage,
    sortField,
    sortDirection,
    timeFilter
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const handleTimeFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1) // Reset to first page when items per page changes
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-500" />
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-400" />
      : <ChevronDown className="w-4 h-4 text-blue-400" />
  }

  // Calculate pagination
  const totalPages = Math.ceil(total / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Leaderboard
          </h2>
          <button
            onClick={refetch}
            disabled={loading}
            className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
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
            onChange={(e) => handleTimeFilterChange(e.target.value as TimeFilter)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
          >
            <option value="all-time">All Time</option>
            <option value="7-days">Last 7 Days</option>
            <option value="24-hours">Last 24 Hours</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-300 text-sm">
            {error} - Showing fallback data
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-400" />
          <span className="ml-2 text-gray-300">Loading leaderboard...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                  Rank
                </th>
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                  <button
                    onClick={() => handleSort('walletAddress')}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    Wallet Address
                    {getSortIcon('walletAddress')}
                  </button>
                </th>
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                  <button
                    onClick={() => handleSort('totalAmountSent')}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    Total Amount
                    {getSortIcon('totalAmountSent')}
                  </button>
                </th>
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                  <button
                    onClick={() => handleSort('walletsReached')}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Users className="w-4 h-4 text-blue-400" />
                    Wallets Reached
                    {getSortIcon('walletsReached')}
                  </button>
                </th>
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                  <button
                    onClick={() => handleSort('tokenAddress')}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    Token Address
                    {getSortIcon('tokenAddress')}
                  </button>
                </th>
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">
                  <button
                    onClick={() => handleSort('tokenSymbol')}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    Token Symbol
                    {getSortIcon('tokenSymbol')}
                  </button>
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
              {data.map((entry, index) => (
                <motion.tr
                  key={`${entry.walletAddress}-${entry.tokenAddress}`}
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
                      {entry.walletsReached.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-white font-mono text-sm">
                      {entry.tokenAddress.slice(0, 8)}...{entry.tokenAddress.slice(-6)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                      {entry.tokenSymbol}
                    </span>
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
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, total)} of {total} entries
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

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No leaderboard data available</p>
          <p className="text-sm">Complete an airdrop to appear on the leaderboard</p>
        </div>
      )}

      {/* Summary Stats */}
      {!loading && data.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Total Participants</div>
              <div className="text-white font-semibold text-xl">{total}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Total Volume</div>
              <div className="text-white font-semibold text-xl">
                ${data.reduce((sum, entry) => sum + parseFloat(entry.totalAmountSent), 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Total Wallets Reached</div>
              <div className="text-white font-semibold text-xl">
                {data.reduce((sum, entry) => sum + entry.walletsReached, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}