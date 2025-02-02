import { createWalletClient, custom, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, mainnet, polygon, optimism, arbitrum } from "wagmi/chains";

export const getCustomWalletSigner = (
  privateKey: `0x${string}`,
  chainId: number = 8453
) => {
  // Determine the chain based on the chainId
  const chain =
    chainId === 1
      ? mainnet
      : chainId === 8453
      ? base
      : chainId === 137
      ? polygon
      : chainId === 10
      ? optimism
      : chainId === 42161
      ? arbitrum
      : mainnet; // Default to mainnet if chainId is not recognized

  const account = privateKeyToAccount(privateKey);

  // Create a wallet client using the private key
  const walletClient = createWalletClient({
    chain,
    transport: http(), // Use HTTP transport for the RPC URL
    account, // Pass the account to the wallet client
  }).extend(publicActions);

  return walletClient;
};


// Advanced transaction with gas estimation
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
    throw error;
  }
};
