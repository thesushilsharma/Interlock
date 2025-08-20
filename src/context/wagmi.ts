import { customWalletConnector } from '@/lib/customConnector';
import { createConfig, http } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  connectors: [customWalletConnector, injected(),
    metaMask(),
    safe(),], // Pass the function itself, not the result of calling it
  chains: [base, polygon, optimism, arbitrum, mainnet],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
});