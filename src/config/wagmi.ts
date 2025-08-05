import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { hyperEVM } from './chains'

export const config = getDefaultConfig({
  appName: 'HyperDrop',
  projectId: 'your-walletconnect-project-id', // Replace with your WalletConnect project ID
  chains: [hyperEVM],
  ssr: false,
})