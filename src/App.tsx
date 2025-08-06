import React, { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Zap, GitBranch } from 'lucide-react'
import { motion } from 'framer-motion'

import { config } from './config/wagmi'
import { WalletConnection } from './components/WalletConnection'
import { TokenSelector } from './components/TokenSelector'
import { CSVHandler } from './components/CSVHandler'
import { AirdropForm } from './components/AirdropForm'
import { AirdropHistory } from './components/AirdropHistory'
import { Leaderboard } from './components/Leaderboard'
import { AirdropData } from './types'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

function App() {
  const [selectedToken, setSelectedToken] = useState<string>('')
  const [airdropData, setAirdropData] = useState<AirdropData[]>([])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#374151',
                  color: '#F3F4F6',
                  border: '1px solid #4B5563',
                },
              }}
            />
            
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white">HyperDrop</h1>
                      <p className="text-gray-400 text-sm">Token Airdrop Platform for HyperEVM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <GitBranch className="w-4 h-4" />
                    <span>HyperEVM Network</span>
                  </div>
                </div>
              </div>
            </motion.header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <WalletConnection />
                <TokenSelector onTokenSelect={setSelectedToken} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <CSVHandler onDataChange={setAirdropData} />
                <AirdropForm 
                  tokenAddress={selectedToken} 
                  recipients={airdropData} 
                />
              </div>

              <div className="mb-8">
                <AirdropHistory />
              </div>

              <Leaderboard />
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center text-gray-400">
                  <p className="mb-2">© 2025 HyperDrop - Token Airdrop Platform</p>
                  <p className="text-sm">Built for the HyperEVM ecosystem</p>
                </div>
              </div>
            </footer>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App