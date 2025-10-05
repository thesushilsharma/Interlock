import type { CreateConnectorFn } from "wagmi";
import type { Address } from "viem";
import { generateCustomWallet } from "./customWallet";
import { getCustomWalletSigner } from "./perfromTransaction";

export const customWalletConnector: CreateConnectorFn = (() => {
  let wallet: { privateKey: string; address: Address } | null = null;
  let currentChainId: number = 8453; // Default to Base Mainnet

  return {
    id: "interlock",
    name: "Interlock - Galactic Gateway",
    type: "custom",
    ready: true,

    options: {
      privateKey: "", // Initialize with an empty string
    },

    async connect(options?: { withCapabilities?: boolean }) {
      try {
        const generatedWallet = await generateCustomWallet();
        wallet = {
          privateKey: generatedWallet.privateKey,
          address: generatedWallet.address as Address,
        };

        const accounts = options?.withCapabilities
          ? [{ address: wallet.address, capabilities: {} }]
          : [wallet.address];

        return {
          accounts: accounts as readonly Address[] | readonly { address: Address; capabilities: Record<string, unknown> }[],
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
        if (wallet) {
          wallet = { ...wallet, address: accounts[0] as Address };
        }
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
        wallet.privateKey as Address,
        currentChainId
      );
    },
  };
}) as CreateConnectorFn;
