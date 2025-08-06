export interface AirdropData {
  address: string
  amount: string
}

export interface LeaderboardEntry {
  walletAddress: string
  totalAmountSent: string
  walletsReached: number
  tokenAddress: string
  tokenSymbol: string
  lastActivity: Date
}

export interface TokenInfo {
  address: string
  symbol: string
  decimals: number
  balance: string
}

export interface AirdropTransaction {
  id: string
  fromAddress: string
  tokenAddress: string
  tokenSymbol: string
  totalRecipients: number
  totalAmount: string
  timestamp: Date
  txHash: string
}