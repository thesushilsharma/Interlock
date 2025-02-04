import { createWalletClient, custom, http, publicActions, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, mainnet, polygon, optimism, arbitrum } from "wagmi/chains";

// Helper function to determine the chain based on chainId
const getChainById = (chainId: number) => {
  switch (chainId) {
    case 1:
      return mainnet;
    case 8453:
      return base;
    case 137:
      return polygon;
    case 10:
      return optimism;
    case 42161:
      return arbitrum;
    default:
      return mainnet; // Default to mainnet if chainId is not recognized
  }
};

export const getCustomWalletSigner = (
  privateKey: `0x${string}`,
  chainId: number = 8453
) => {
  const chain = getChainById(chainId);
  const account = privateKeyToAccount(privateKey);

  // Create a wallet client using the private key
  const walletClient = createWalletClient({
    chain,
    transport: http(), // Use HTTP transport for the RPC URL
    account, // Pass the account to the wallet client
  }).extend(publicActions);

  return walletClient;
};

export const sendAdvancedTransaction = async (
  privateKey: `0x${string}`,
  to: `0x${string}`,
  value: bigint,
  chainId: number = 8453
) => {
  const walletClient = getCustomWalletSigner(privateKey, chainId);

  try {
    // Estimate gas for the transaction
    const gasEstimate = await walletClient.estimateGas({
      account: walletClient.account,
      to,
      value,
    });

    console.log("Estimated gas:", gasEstimate);

    // Send the transaction with the estimated gas
    const hash = await walletClient.sendTransaction({
      account: walletClient.account,
      to,
      value,
      gas: gasEstimate, // Use the estimated gas
    });

    console.log("Transaction hash:", hash);
    return hash;
  } catch (error) {
    console.error("Failed to send transaction:", error);
    throw new Error("Failed to send transaction");
  }
};


export const getBalance = async (privateKey: `0x${string}`, chainId: number = 8453) => {
  const walletClient = getCustomWalletSigner(privateKey, chainId);

  try {
    const balance = await walletClient.getBalance({
      address: walletClient.account.address,
      blockTag: 'safe',
    });

    const balanceAsEther = formatEther(balance);
    console.log("Balance in Ether:", balanceAsEther);
    return balanceAsEther;
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    throw new Error("Failed to fetch balance");
  }
};