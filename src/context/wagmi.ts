import { customWalletConnector } from '@/lib/customConnector';
import { createConfig, http } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

export const config = createConfig({
  connectors: [customWalletConnector], // Pass the function itself, not the result of calling it
  chains: [base, polygon, optimism, arbitrum, mainnet],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
});