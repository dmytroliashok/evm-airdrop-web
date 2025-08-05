import React, { useState } from 'react'
import { Coins, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTokenInfo } from '../hooks/useTokenInfo'
import { useAccount } from 'wagmi'

interface TokenSelectorProps {
  onTokenSelect: (tokenAddress: string) => void
}

export function TokenSelector({ onTokenSelect }: TokenSelectorProps) {
  const [tokenAddress, setTokenAddress] = useState('')
  const { isConnected } = useAccount()
  const tokenInfo = useTokenInfo(tokenAddress || undefined)

  const handleAddressChange = (address: string) => {
    setTokenAddress(address)
    if (address) {
      onTokenSelect(address)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
    >
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Coins className="w-5 h-5 text-green-400" />
        Token Selection
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Token Contract Address
          </label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="0x... (Leave empty for native HYPE)"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {tokenAddress && tokenInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
          >
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Token Information</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Symbol</div>
                <div className="text-white font-medium">{tokenInfo.symbol}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Decimals</div>
                <div className="text-white font-medium">{tokenInfo.decimals}</div>
              </div>
            </div>

            {isConnected && (
              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="text-gray-400 text-sm mb-1">Your Balance</div>
                <div className="text-white font-semibold text-lg">
                  {parseFloat(tokenInfo.balance).toFixed(4)} {tokenInfo.symbol}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}