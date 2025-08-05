import { defineChain } from 'viem'

// export const hyperEVM = defineChain({
//   id: 999, // HyperEVM Mainnet chain ID
//   name: 'HyperEVM',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'HYPE',
//     symbol: 'HYPE',
//   },
//   rpcUrls: {
//     default: {
//       http: ['https://rpc.hyperliquid.xyz/evm'],
//     },
//   },
//   blockExplorers: {
//     default: { name: 'HyperScan', url: 'https://www.hyperscan.com' },
//   },
// })

export const hyperEVM = defineChain({
  id: 11155111, // Sepolia chain ID
  name: 'Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.drpc.org'],
    },
  },
  blockExplorers: {
    default: { name: 'SepoliaScan', url: 'https://sepolia.etherscan.io/' },
  },
})