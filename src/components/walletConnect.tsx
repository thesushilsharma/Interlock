"use client";
import { useState } from "react";
import { useConnect, useAccount, useChainId, useDisconnect } from "wagmi";

function WalletConnect() {
  const { connect, connectors } = useConnect();
  const { address, isConnecting, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const customConnector = connectors.find((connector) => connector.id === "interlock");

  const handleGenerateWallet = async () => {
    if (!customConnector) {
      setError("Custom connector not found");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await connect({ connector: customConnector, chainId });
    } catch (err) {
      setError("Failed to connect wallet");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-900 text-white rounded-lg shadow-lg w-80">
      {isConnected ? (
        <div className="text-center">
          <p className="text-lg font-semibold">Connected</p>
          <p className="text-sm text-gray-300 break-all">{address}</p>
          <button
            onClick={() => disconnect()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={handleGenerateWallet}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-semibold transition ${isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
          >
            {isLoading || isConnecting ? "Connecting..." : "Connect with Custom Wallet"}
          </button>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default WalletConnect;
