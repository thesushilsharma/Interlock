"use server";
import { type Address } from "viem";
import bip39 from "bip39";
import { Wallet } from "@ethereumjs/wallet";
import { HDNodeWallet } from "ethers";
import {
  generateMnemonic,
  mnemonicToAccount,
  english,
  generatePrivateKey,
  privateKeyToAccount,
} from "viem/accounts";

/**
 * Generates a new random Ethereum wallet.
 *
 * This creates a random private key and derives the corresponding
 * Ethereum address. Useful for quickly creating new wallet instances
 * without a mnemonic phrase (non-recoverable).
 *
 * @returns {Promise<{ privateKey: Address; address: Address}>}
 * An object containing:
 * - `privateKey`: the wallet's private key (keep it secret!)
 * - `address`: the derived Ethereum address
 */
export async function generateCustomWallet(): Promise<{
  privateKey: Address;
  address: Address;
}> {
  console.log("Generating new wallet...");

  const wallet = Wallet.generate(); // from @ethereumjs/wallet
  const privateKey = wallet.getPrivateKeyString();
  const address = wallet.getAddressString();

  console.log("Wallet generated:", { privateKey, address });

  return {
    privateKey: privateKey as Address,
    address: address as Address,
  };
}

/**
 * Generate a wallet with mnemonic, private key, and address (Ethers v6 compatible)
 * @param {128 | 256} [strength=128] - Entropy bits for mnemonic (128 = 12 words, 256 = 24 words)
 * @returns {Promise<{ mnemonic: string; privateKey: Address; address: Address; ethereumjsWallet: Wallet }>}
 */
export async function generateWallet(strength: 128 | 256 = 128): Promise<{
  mnemonic: string;
  privateKey: Address;
  address: Address;
  ethereumjsWallet: Wallet;
}> {
  const mnemonic = bip39.generateMnemonic(strength);
  const hdNode = HDNodeWallet.fromPhrase(mnemonic);
  const { address, privateKey } = hdNode;

  const privateKeyBuffer = Buffer.from(privateKey.slice(2), "hex");
  const ethereumjsWallet = Wallet.fromPrivateKey(privateKeyBuffer);

  return {
    mnemonic,
    privateKey: privateKey as Address,
    address: address as Address,
    ethereumjsWallet,
  };
}

/**
 * Generate a new Ethereum wallet (using viem + ethereumjs)
 * @param {number} wordCount - 12 or 24 (default 12)
 * @returns {Promise<{ mnemonic: string, privateKey: Addess, address: Address, ethereumjsWallet: any }>}
 */
export async function generateEVMWallet(wordCount: 12 | 24 = 12): Promise<{
  mnemonic: string;
  privateKey: Address;
  address: Address;
  ethereumjsWallet: Wallet;
}> {
  const strength = wordCount === 24 ? 256 : 128;
  const mnemonic = generateMnemonic(english, strength);
  const account = mnemonicToAccount(mnemonic);
  const hdKey = account.getHdKey();

  if (!hdKey.privateKey) {
    throw new Error("Failed to derive private key from mnemonic.");
  }

  const privateKey = hdKey.privateKey;
  const address = account.address;

  const privateKeyBuffer = Buffer.from(privateKey);
  const ethereumjsWallet = Wallet.fromPrivateKey(privateKeyBuffer);

  return {
    mnemonic,
    privateKey: `0x${Buffer.from(privateKey).toString("hex")}`,
    address,
    ethereumjsWallet,
  };
}

/**
 * Generates a new random Ethereum wallet using Viem.
 *
 * This function creates a random private key using `generatePrivateKey()`
 * and derives the corresponding Ethereum account (address) using
 * `privateKeyToAccount()`.
 *
 * ⚠️ Note: This wallet is *ephemeral* (not mnemonic-based).
 * Keep the private key safe; it cannot be recovered if lost.
 *
 * @returns {Promise<{ privateKey: Address; address: Address }>}
 * An object containing:
 * - `privateKey`: The newly generated private key
 * - `address`: The derived Ethereum address
 */
export async function generateCustomEVMWallet(): Promise<{
  privateKey: Address;
  address: Address;
}> {
  console.log("🔄 Generating new wallet...");

  // 1️⃣ Generate a random private key
  const privateKey = generatePrivateKey();

  // 2️⃣ Create an account object from that key
  const account = privateKeyToAccount(privateKey);

  console.log("✅ Wallet generated:", {
    privateKey,
    address: account.address,
  });

  return {
    privateKey,
    address: account.address as Address,
  };
}
