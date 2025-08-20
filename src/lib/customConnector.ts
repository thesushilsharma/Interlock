import { CreateConnectorFn } from "wagmi";
import { generateCustomWallet } from "./customWallet";
import { getCustomWalletSigner } from "./perfromTransaction";

export const customWalletConnector: CreateConnectorFn = () => {
  let wallet: { privateKey: string; address: `0x${string}` } | null = null;
  let currentChainId: number = 8453; // Default to Base Mainnet

  return {
    id: "interlock",
    name: "Interlock - Galactic Gateway",
    type: "custom",
    ready: true,

    options: {
      privateKey: "", // Initialize with an empty string
    },

    async connect() {
      try {
        const generatedWallet = await generateCustomWallet();
        wallet = {
          privateKey: generatedWallet.privateKey,
          address: generatedWallet.address as `0x${string}`,
        };
        return {
          accounts: [wallet.address],
          chainId: currentChainId,
        };
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        throw new Error("Failed to connect wallet");
      }
    },

    async disconnect() {
      wallet = null;
      currentChainId = 8453; // Reset to default chain (Base Mainnet)
    },

    async getAccounts() {
      return wallet ? [wallet.address] : [];
    },

    async getChainId() {
      return currentChainId;
    },

    async isAuthorized() {
      return !!wallet;
    },

    onAccountsChanged(accounts: string[]) {
      if (accounts.length === 0) {
        wallet = null; // Clear wallet if no accounts are available
      } else {
        // Update wallet address if it changes
        wallet = { ...wallet!, address: accounts[0] as `0x${string}` };
      }
    },

    onChainChanged(chainId: string | number) {
      // Ensure chainId is converted to a number
      currentChainId =
        typeof chainId === "string" ? parseInt(chainId, 10) : chainId;
    },

    onDisconnect() {
      wallet = null; // Clear wallet on disconnect
      currentChainId = 8453; // Reset to default chain (Base Mainnet)
    },

    async getProvider() {
      throw new Error("Provider not available for custom wallet");
    },

    async getSigner() {
      if (!wallet) {
        throw new Error("Wallet is not connected");
      }
      return getCustomWalletSigner(
        wallet.privateKey as `0x${string}`,
        currentChainId
      );
    },
  };
};
