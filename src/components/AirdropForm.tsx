import React, { useState } from "react";
import { Send, Loader, Shield, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { AirdropData } from "../types";
import { useTokenInfo } from "../hooks/useTokenInfo";
import { useAirdropAPI } from "../hooks/useAirdropAPI";
import toast from "react-hot-toast";
import { config } from "../config/wagmi";

// ERC20 ABI for approve function
const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

// Replace with your actual airdrop contract address
const AIRDROP_CONTRACT_ADDRESS = "0x1e3a0AD09978f9c7bfCEA6b5eeE5bDC7DE8B324d";

const AIRDROP_CONTRACT_ABI = [
  {
    name: "drop",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "recipients",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    outputs: [],
  },
] as const;

interface AirdropFormProps {
  tokenAddress?: string;
  recipients: AirdropData[];
}

export function AirdropForm({ tokenAddress, recipients }: AirdropFormProps) {
  const { address: walletAddress } = useAccount();
  const [isExecuting, setIsExecuting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalStep, setApprovalStep] = useState<
    "none" | "checking" | "needed" | "approved"
  >("none");

  const tokenInfo = useTokenInfo(tokenAddress);
  const { saveAirdropData, isSaving } = useAirdropAPI();

  // Check current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args:
      walletAddress && tokenAddress
        ? [walletAddress, AIRDROP_CONTRACT_ADDRESS as `0x${string}`]
        : undefined,
    query: { enabled: !!walletAddress && !!tokenAddress },
  });

  const totalAmount = recipients.reduce(
    (sum, recipient) => sum + parseFloat(recipient.amount || "0"),
    0
  );

  const checkApprovalNeeded = () => {
    if (!tokenAddress || !tokenInfo || allowance === undefined) return false;

    const totalAmountBigInt = parseUnits(
      totalAmount.toString(),
      tokenInfo.decimals
    );
    return (allowance as bigint) < totalAmountBigInt;
  };

  // Check approval status when data changes
  React.useEffect(() => {
    if (tokenAddress && tokenInfo && allowance !== undefined) {
      const needsApproval = checkApprovalNeeded();
      setApprovalStep(needsApproval ? "needed" : "approved");
    } else if (!tokenAddress) {
      setApprovalStep("none"); // Native token doesn't need approval
    }
  }, [tokenAddress, tokenInfo, allowance, totalAmount]);

  const { writeContract: approve, data: approveTxHash } = useWriteContract();
  // Wait for transaction confirmation
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveTxHash,
    });

  const handleApprove = async () => {
    if (!tokenAddress || !tokenInfo) {
      toast.error("Token information not available");
      return;
    }

    setIsApproving(true);

    try {
      const totalAmountBigInt = parseUnits(
        totalAmount.toString(),
        tokenInfo.decimals
      );

      approve({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [AIRDROP_CONTRACT_ADDRESS as `0x${string}`, totalAmountBigInt],
      });

      toast.loading("Waiting for approval confirmation...");
    } catch (error) {
      toast.error("Token approval failed");
      console.error("Approval error:", error);
      setApprovalStep("needed");
    }
  };

  React.useEffect(() => {
    if (isApproveConfirming) {
      toast.loading("Transaction confirming...");
    }
    if (isApproveSuccess) {
      toast.dismiss();
      refetchAllowance();
      setApprovalStep("approved");
      setIsApproving(false);
      toast.success("Token approval successful!");
    }
  }, [isApproveConfirming, isApproveSuccess]);

  const {
    writeContract: writeAirdrop,
    data: txHash,
    isPaused
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess,
    isError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleExecuteAirdrop = async () => {
    if (recipients.length === 0) {
      toast.error("No recipients added");
      return;
    }

    const invalidRecipients = recipients.filter(
      (r) => !r.address || !r.amount || parseFloat(r.amount) <= 0
    );
    if (invalidRecipients.length > 0) {
      toast.error("Please check all recipient addresses and amounts");
      return;
    }

    setIsExecuting(true);

    const recipientAddresses = recipients.map((r) => r.address);
    const recipientAmounts =
      tokenInfo && recipients.length > 0
        ? recipients.map((r) => parseUnits(r.amount, tokenInfo.decimals))
        : [];

    try {
      // This would integrate with your smart contract
      writeAirdrop({
        address: AIRDROP_CONTRACT_ADDRESS as `0x${string}`,
        abi: AIRDROP_CONTRACT_ABI,
        functionName: "drop",
        args: [
          tokenAddress as `0x${string}`,
          recipientAddresses as `0x${string}`[],
          recipientAmounts,
        ],
      });
    } catch (error) {
      toast.error("Airdrop execution failed");
      console.error("Airdrop error:", error);
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      setIsExecuting(false);
      toast.dismiss();
      toast.success(
        `Airdrop executed successfully to ${recipients.length} recipients!`
      );
      
      // Save airdrop data to backend
      if (txHash && walletAddress) {
        saveAirdropToBackend(txHash);
      }
    }
    if (isError) {
      setIsExecuting(false);
      toast.dismiss();
      toast.error("Airdrop execution failed");
    }
    if (isPaused) {
      setIsExecuting(false);
      toast.dismiss();
      toast.error("Airdrop execution canceled");
    }
  }, [isConfirming, isSuccess, isError, isPaused, recipients.length]);

  const saveAirdropToBackend = async (transactionHash: string) => {
    if (!walletAddress || !tokenInfo) return;

    const totalAmount = recipients.reduce(
      (sum, recipient) => sum + parseFloat(recipient.amount || "0"),
      0
    );

    await saveAirdropData({
      fromAddress: walletAddress,
      tokenAddress: tokenAddress || 'native', // Use 'native' for native tokens
      tokenSymbol: tokenInfo?.symbol || 'HYPE',
      recipients: recipients,
      totalAmount: totalAmount.toString(),
      txHash: transactionHash,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
    >
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Send className="w-5 h-5 text-orange-400" />
        Execute Airdrop
      </h2>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Token</div>
            <div className="text-white font-semibold">
              {tokenAddress
                ? `${tokenAddress.slice(0, 8)}...`
                : "HYPE (Native)"}
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Recipients</div>
            <div className="text-white font-semibold text-xl">
              {recipients.length}
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Total Amount</div>
            <div className="text-white font-semibold text-xl">
              {totalAmount.toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {/* Show approve button for ERC20 tokens that need approval */}
      {tokenAddress && approvalStep === "needed" && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApprove}
          disabled={isApproving || recipients.length === 0}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
        >
          {isApproving ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Approving Token...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Approve Token Spending
            </>
          )}
        </motion.button>
      )}

      {/* Show airdrop button when approved or for native tokens */}
      {(approvalStep === "approved" || approvalStep === "none") && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExecuteAirdrop}
          disabled={isExecuting || recipients.length === 0 || isSaving}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
        >
          {isExecuting || isSaving ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              {isExecuting ? 'Executing Airdrop...' : 'Saving Data...'}
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Execute Airdrop
            </>
          )}
        </motion.button>
      )}

      {/* Show approval success message */}
      {approvalStep === "approved" && tokenAddress && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-green-300 text-sm font-medium">
              Token spending approved! You can now execute the airdrop.
            </p>
          </div>
        </div>
      )}

      {isSaving && (
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Loader className="w-5 h-5 animate-spin text-blue-400" />
            <p className="text-blue-300 text-sm font-medium">Saving airdrop data...</p>
          </div>
        </div>
      )}

      {recipients.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-300 text-sm">
            Add recipients to enable airdrop execution
          </p>
        </div>
      )}
    </motion.div>
  );
}