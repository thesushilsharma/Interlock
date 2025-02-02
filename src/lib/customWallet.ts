import { Wallet } from '@ethereumjs/wallet'

// Generate a new Ethereum wallet
export const generateCustomWallet = () => {
    console.log('Generating new wallet...')
    const wallet = Wallet.generate();
    const privateKey = wallet.getPrivateKeyString();
    const address = wallet.getAddressString();

    console.log("Wallet generated:", { privateKey, address })

    return {
        privateKey,
        address: address as `0x${string}`, // Ensure address is in the correct format
    };
};
