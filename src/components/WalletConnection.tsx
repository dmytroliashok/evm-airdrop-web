import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance } from 'wagmi'
import { Wallet, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export function WalletConnection() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address,
    query: { enabled: !!address }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-400" />
          Wallet Connection
        </h2>
        <ConnectButton />
      </div>
      
      {isConnected && address && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Connected Address</div>
            <div className="text-white font-mono text-sm">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          </div>
          
          {balance && (
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                HYPE Balance
              </div>
              <div className="text-white font-semibold text-lg">
                {parseFloat(balance.formatted).toFixed(4)} HYPE
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}