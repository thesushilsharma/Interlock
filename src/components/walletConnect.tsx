"use client";
import { useActionState, useEffect } from "react";
import { useConnect, useAccount, useChainId, useDisconnect } from "wagmi";
import { toast } from 'sonner';

function WalletConnect() {
  const { connect, connectors } = useConnect();
  const { address, isConnecting, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const customConnector = connectors.find((connector) => connector.id === "interlock");

  // Define the initial state for the action
  const initialState = {
    status: "idle", // Possible values: "idle", "loading", "success", "error"
    message: null as string | null,
  };

  // Action handler for generating/connecting the wallet
  const handleGenerateWallet = async (prevState: typeof initialState) => {
    if (!customConnector) {
      return { ...prevState, status: "error", message: "Custom connector not found" };
    }

    try {
      // Update state to loading
      await connect({ connector: customConnector, chainId });
      return { status: "success", message: "Wallet connected successfully!" };
    } catch (err) {
      console.error(err);
      return { status: "error", message: "Failed to connect wallet" };
    }
  };

  // Use useActionState to manage the state of the action
  const [state, formAction] = useActionState(handleGenerateWallet, initialState);

  // Handle side effects based on the action state
  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
    if (state.status === "success" && state.message) {
      toast.success(state.message);
    }
  }, [state]);

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
        <form action={formAction} className="text-center">
          <button
            type="submit"
            disabled={state.status === "loading" || isConnecting}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              state.status === "loading" || isConnecting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {state.status === "loading" || isConnecting
              ? "Connecting..."
              : "Connect with Custom Wallet"}
          </button>
          {state.status === "error" && state.message && (
            <p className="mt-2 text-sm text-red-400">{state.message}</p>
          )}
        </form>
      )}
    </div>
  );
}

export default WalletConnect;