'use client';

import { useEffect, useState } from 'react';
import { Contract, RpcProvider } from 'starknet';
import abi from './contracts/abi/WavePortal.abi.json';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useCallAnyContract } from "@chipi-pay/chipi-sdk";
import Confetti from 'react-confetti';

const CONTRACT_ADDRESS = '0x0638aa7782bfa69cbd9162fd3cfc086038dfc055fe200fe115a9b1c88b20b941';
const EVENT_KEY = '0x01b1d6c3fc5d2623b725e2a645cba4333d2b8bc1a81895c633380cff638b293f';

/**
 * WavePortal - A Simple Starknet App Template
 * 
 * This template demonstrates how to interact with Starknet blockchain:
 * - Connect your Starknet wallet (Argent X, Braavos)
 * - Send messages that are stored on-chain
 * - View messages from other users
 * 
 * The WavePortal Cairo contract:
 * - Records all messages as on-chain events
 * - Counts total waves sent
 * - Has a 21% chance to reward users with tokens when they wave
 */

export default function Home() {
  const [message, setMessage] = useState('');
  const [waves, setWaves] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<string>('0');
  const [refreshing, setRefreshing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { isSignedIn, user } = useUser();
  const router = useRouter();
  
  // Access the full hook result without destructuring
  const chipiContract = useCallAnyContract();
  
  // Debugging
  console.log("Full Chipi Contract object:", chipiContract);

  // Add state for PIN
  const [pin, setPin] = useState("");

  // Get wallet from Clerk metadata
  const wallet = user?.publicMetadata?.publicKey && user?.publicMetadata?.encryptedPrivateKey
    ? {
        publicKey: user.publicMetadata.publicKey as string,
        encryptedPrivateKey: user.publicMetadata.encryptedPrivateKey as string,
      }
    : null;

  // Log wallet data for debugging
  useEffect(() => {
    if (wallet) {
      console.log("Wallet data available:", {
        publicKey: wallet.publicKey.substring(0, 10) + '...',
        hasPrivateKey: !!wallet.encryptedPrivateKey
      });
    }
  }, [wallet]);

  // Prepare calldata for the wave function
  const getCalldata = (message: string) => {
    // Convert each character to its code point and then to string
    const feltArr = Array.from(message).map((c) => BigInt(c.charCodeAt(0)).toString());
    // Return array with length as first element, also as string
    return [feltArr.length.toString(), ...feltArr];
  };

  const fetchWaves = async () => {
    try {
      setRefreshing(true);
      const provider = new RpcProvider({ nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_8' });
      const latestBlock = await provider.getBlockLatestAccepted();
      const events = await provider.getEvents({
        address: CONTRACT_ADDRESS,
        keys: [[EVENT_KEY]],
        from_block: { block_number: 1410539 },
        to_block: { block_number: latestBlock.block_number },
        chunk_size: 20,
      });

      const messages: string[] = [];
      for (const e of events.events) {
        const rawData = e.data.slice(2);
        const decoded = rawData.map((b: string) => String.fromCharCode(Number(BigInt(b)))).join('');
        messages.push(decoded);
      }
      setWaves(messages.reverse());
      setTotal(messages.length.toString());
    } catch (err) {
      console.error('Error fetching waves:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const getTotalWaves = async () => {
    try {
      const provider = new RpcProvider({ nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_8' });
      const contract = new Contract(abi, CONTRACT_ADDRESS, provider);
      const result = await contract.call('total_waves', []);
      let count;
      if (typeof result === 'object' && result !== null && 'total_waves' in result) {
        count = result.total_waves;
      } else if (Array.isArray(result)) {
        count = result[0];
      } else {
        count = 0;
      }
      setTotal(BigInt(count).toString());
    } catch (err) {
      console.error('Error getting total waves:', err);
      setTotal('0');
    }
  };

  const sendWave = async () => {
    if (!wallet || !pin || !message) {
      alert("Missing wallet, PIN, or message");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Preparing to send wave");
      
      const callData = getCalldata(message);
      console.log("Calldata prepared:", callData);
      console.log("Contract address:", CONTRACT_ADDRESS);
      
      // Use the correct method name that's available in the SDK
      const callFn = chipiContract.callAnyContractAsync;
      
      if (!callFn) {
        throw new Error(`The callAnyContractAsync method is not available in this SDK version.`);
      }
      
      console.log("Using method: callAnyContractAsync");
      
      // Try with explicit network settings and error handling
      const payload = {
        encryptKey: pin,
        wallet: {
          publicKey: wallet.publicKey,
          encryptedPrivateKey: wallet.encryptedPrivateKey
        },
        calls: [
          {
            contractAddress: CONTRACT_ADDRESS,
            entrypoint: "wave",
            calldata: callData
          }
        ],
        // Add the following optional parameters that might help
        network: "mainnet", // Explicitly specify network (or "testnet" if applicable)
        maxFee: "1000000000000000", // Set a max fee (optional)
        nonce: undefined // Let the service calculate nonce (optional)
      };
      
      console.log("Sending payload:", JSON.parse(JSON.stringify(payload)));
      
      // Structure the request with a 'calls' array as required by the API
      const result = await callFn(payload);
      
      console.log("Wave sent successfully:", result);
      setMessage("");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Show for 5 seconds
    } catch (err) {
      console.error("Error sending wave:", err);
      
      // More detailed error parsing
      if (err instanceof Error) {
        console.error("Error details:", err.message);
        console.error("Error stack:", err.stack);
        
        // Try to extract more details if this is an API error
        try {
          if (err.message.includes('{"statusCode":500')) {
            console.error("This appears to be a server error on Chipi's backend. It might be temporary or require SDK configuration changes.");
            // Extract more details if possible
            const errorMatch = err.message.match(/\{.*\}/);
            if (errorMatch) {
              const errorJson = JSON.parse(errorMatch[0]);
              console.error("Detailed API error:", errorJson);
            }
          }
        } catch (parseErr) {
          console.error("Could not parse error details:", parseErr);
        }
      }
      
      alert("Error sending wave: " + (err instanceof Error ? err.message : String(err)) + 
            "\n\nThis may be a temporary issue with the Chipi service. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchWaves();
    getTotalWaves();

    // Setup a regular refresh every 15 seconds while the app is open
    const refreshInterval = setInterval(() => {
      if (!loading) { // Don't refresh if we're in the middle of sending a wave
        fetchWaves();
        getTotalWaves();
      }
    }, 15000);

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center p-4">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-md bg-cyan-400/10 p-8 rounded-2xl shadow-2xl max-w-md w-full text-white border border-cyan-300/20"
      >
        <h1 className="text-3xl font-extrabold mb-4 text-cyan-300">🌊 WavePortal</h1>

        {!isSignedIn ? (
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-cyan-400/20 hover:bg-cyan-400/30 transition px-4 py-2 rounded-lg font-medium w-full mb-4"
          >
            Sign-in
          </button>
        ) : (
          <>
            {!wallet ? (
              <div>
                <p className="text-cyan-200 mb-4">You need to complete onboarding to create a wallet.</p>
                <button
                  onClick={() => router.push('/onboarding')}
                  className="bg-cyan-400/20 hover:bg-cyan-400/30 transition px-4 py-2 rounded-lg font-medium w-full mb-4"
                >
                  Complete Onboarding
                </button>
              </div>
            ) : (
              <>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 rounded-lg bg-cyan-200/10 border border-cyan-200/20 resize-none mb-4 text-white placeholder:text-cyan-200/50"
                  rows={3}
                  placeholder="Your wave message..."
                  disabled={loading}
                />
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full p-2 rounded-lg bg-cyan-200/10 border border-cyan-200/20 resize-none mb-4 text-white placeholder:text-cyan-200/50"
                  placeholder="Enter PIN"
                  disabled={loading}
                />
                <button
                  onClick={sendWave}
                  disabled={loading}
                  className="bg-cyan-400/20 hover:bg-cyan-400/30 transition px-4 py-2 rounded-lg font-medium w-full flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <ClipLoader size={16} color="#9DECF9" className="mr-2" />
                      {'Sending...'}
                    </>
                  ) : (
                    '🌊 Send Wave'
                  )}
                </button>
              </>
            )}
          </>
        )}

        {total && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-cyan-100">Total waves: <strong>{total}</strong></p>
            <button 
              onClick={() => {
                fetchWaves();
                getTotalWaves();
              }}
              disabled={refreshing}
              className="text-xs text-cyan-300 hover:text-cyan-100 transition flex items-center"
            >
              {refreshing ? (
                <>
                  <ClipLoader size={10} color="#9DECF9" className="mr-1" />
                  Refreshing...
                </>
              ) : (
                'Refresh'
              )}
            </button>
          </div>
        )}
        <div className="mt-2 max-h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-cyan-400/30 scrollbar-track-transparent">
          {waves.length > 0 ? (
            waves.map((wave, i) => (
              <div key={i} className="bg-cyan-400/10 p-2 rounded text-sm border border-cyan-200/20">
                {wave}
              </div>
            ))
          ) : (
            <div className="text-center text-cyan-200/50 py-4">No waves yet. Be the first to wave! 👋</div>
          )}
        </div>
      </motion.div>
    </main>
  );
}
