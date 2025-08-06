import React, { useState, useEffect } from 'react'
import { History, ExternalLink, Clock, Users, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { useAirdropAPI } from '../hooks/useAirdropAPI'
import { AirdropTransaction } from '../types'

export function AirdropHistory() {
  const { address: walletAddress } = useAccount()
  const { getAirdropHistory } = useAirdropAPI()
  const [history, setHistory] = useState<AirdropTransaction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (walletAddress) {
      fetchHistory()
    }
  }, [walletAddress])

  const fetchHistory = async () => {
    if (!walletAddress) return
    
    setLoading(true)
    try {
      const data = await getAirdropHistory(walletAddress)
      setHistory(data)
    } catch (error) {
      console.error('Failed to fetch airdrop history:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const openInExplorer = (txHash: string) => {
    // Replace with your network's block explorer URL
    const explorerUrl = 'https://sepolia.etherscan.io/tx/'
    window.open(`${explorerUrl}${txHash}`, '_blank')
  }

  if (!walletAddress) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          Airdrop History
        </h2>
        <div className="text-center py-8 text-gray-400">
          <p>Connect your wallet to view airdrop history</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          Airdrop History
        </h2>
        <button
          onClick={fetchHistory}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading airdrop history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No airdrop history found</p>
          <p className="text-sm">Your completed airdrops will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((transaction) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-700 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <DollarSign className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {transaction.tokenSymbol} Airdrop
                    </div>
                    <div className="text-gray-400 text-sm">
                      {transaction.timestamp.toLocaleDateString()} at{' '}
                      {transaction.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-600 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 text-sm">Recipients</span>
                  </div>
                  <div className="text-white font-semibold">
                    {transaction.totalRecipients}
                  </div>
                </div>
                <div className="bg-gray-600 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">Total Amount</span>
                  </div>
                  <div className="text-white font-semibold">
                    {parseFloat(transaction.totalAmount).toFixed(4)} {transaction.tokenSymbol}
                  </div>
                </div>
                <div className="bg-gray-600 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 text-sm">Token Address</span>
                  </div>
                  <div className="text-white font-mono text-sm">
                    {transaction.tokenAddress === 'native' 
                      ? 'Native Token' 
                      : `${transaction.tokenAddress.slice(0, 8)}...${transaction.tokenAddress.slice(-6)}`
                    }
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm font-mono">
                  TX: {transaction.txHash.slice(0, 10)}...{transaction.txHash.slice(-8)}
                </div>
                <button
                  onClick={() => openInExplorer(transaction.txHash)}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-gray-300 hover:text-white rounded-md transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Explorer
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}