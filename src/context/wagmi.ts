import { customWalletConnector } from "@/lib/customConnector";
import { createConfig, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { injected, metaMask, safe } from "wagmi/connectors";
import { createClient } from "viem";

export const config = createConfig({
  connectors: [customWalletConnector, injected(), metaMask(), safe()], // Pass the function itself, not the result of calling it
  chains: [base, polygon, optimism, arbitrum, mainnet],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});
