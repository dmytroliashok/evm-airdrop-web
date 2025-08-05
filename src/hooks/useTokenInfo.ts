import { useState, useEffect } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import { formatUnits } from 'viem'
import { TokenInfo } from '../types'

// ERC20 ABI for token info and balance
const ERC20_ABI = [
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

export function useTokenInfo(tokenAddress: string | undefined) {
  const { address: walletAddress } = useAccount()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)

  const { data: symbol } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: { enabled: !!tokenAddress },
  })

  const { data: decimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { enabled: !!tokenAddress },
  })

  const { data: balance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: walletAddress ? [walletAddress] : undefined,
    query: { enabled: !!tokenAddress && !!walletAddress },
  })

  useEffect(() => {
    if (tokenAddress && symbol && decimals !== undefined && balance !== undefined) {
      setTokenInfo({
        address: tokenAddress,
        symbol: symbol as string,
        decimals: decimals as number,
        balance: formatUnits(balance as bigint, decimals as number),
      })
    }
  }, [tokenAddress, symbol, decimals, balance])

  return tokenInfo
}