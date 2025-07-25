Project Path: chipi-sdk-waveportal

Source Tree:

```txt
chipi-sdk-waveportal
└── src
    └── app
        ├── StarknetProviderWrapper.tsx
        ├── globals.css
        ├── layout.tsx
        └── page.tsx

```

`chipi-sdk-waveportal/src/app/StarknetProviderWrapper.tsx`:

```tsx
'use client';

import { StarknetConfig, InjectedConnector, publicProvider } from '@starknet-react/core';
import { mainnet } from '@starknet-react/chains';
import type { ReactNode } from 'react';

const connectors = [
  new InjectedConnector({ options: { id: 'argentX' } }),
  new InjectedConnector({ options: { id: 'braavos' } }),
];

export default function StarknetProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={publicProvider()}
      connectors={connectors}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}

```

`chipi-sdk-waveportal/src/app/globals.css`:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

```

`chipi-sdk-waveportal/src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StarknetProviderWrapper from './StarknetProviderWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wave Portal | Chipi SDK",
  description: "Ship on Mainnet in under a week.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StarknetProviderWrapper>
          {children}
        </StarknetProviderWrapper>
      </body>
    </html>
  );
}

```

`chipi-sdk-waveportal/src/app/page.tsx`:

```tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { Contract, RpcProvider, CallData } from 'starknet';
import { useAccount, useConnect } from '@starknet-react/core';
import abi from './contracts/abi/WavePortal.abi.json';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { ClipLoader } from 'react-spinners';

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
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { width, height } = useWindowSize();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { account } = useAccount();
  const { connectors, connect } = useConnect();

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

  const checkTransactionStatus = async (txHash: string) => {
    try {
      const provider = new RpcProvider({ nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_8' });
      const receipt = await provider.getTransactionReceipt(txHash);
      
      // Check if the transaction is accepted on L2
      const isAccepted = 
        receipt && 
        'execution_status' in receipt && 
        receipt.execution_status === 'SUCCEEDED' &&
        'finality_status' in receipt &&
        receipt.finality_status === 'ACCEPTED_ON_L2';
      
      if (isAccepted) {
        setTxHash(null);
        setLoading(false);
        fetchWaves();
        getTotalWaves();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error checking transaction status:', err);
      return false;
    }
  };

  const pollForConfirmation = async (txHash: string) => {
    let attempts = 0;
    const maxAttempts = 20; // Try for about 2 minutes
    
    const poll = async () => {
      if (attempts >= maxAttempts) {
        setLoading(false);
        setTxHash(null);
        return;
      }
      
      const confirmed = await checkTransactionStatus(txHash);
      if (!confirmed) {
        attempts++;
        setTimeout(poll, 6000); // Check every 6 seconds
      }
    };
    
    await poll();
  };

  const sendWave = async () => {
    if (!account || !message) return;
    setLoading(true);
    try {
      const feltArr = Array.from(message).map((c) => BigInt(c.charCodeAt(0)));
      const calldata = CallData.compile({ message: feltArr });
  
      const res = await account.execute({
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: 'wave',
        calldata,
      });
  
      console.log('Wave sent:', res.transaction_hash);
      setMessage('');
      setTxHash(res.transaction_hash);
      pollForConfirmation(res.transaction_hash);
    } catch (err) {
      console.error('Error sending wave:', err);
      setLoading(false);
    }
  };

  // Start automatic refresh when transaction is confirmed
  useEffect(() => {
    // Clear existing interval if there is one
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    // If transaction is submitted, start refreshing
    if (txHash) {
      refreshIntervalRef.current = setInterval(() => {
        fetchWaves();
        getTotalWaves();
      }, 5000); // Refresh every 5 seconds
    }

    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [txHash]);

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
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-md bg-cyan-400/10 p-8 rounded-2xl shadow-2xl max-w-md w-full text-white border border-cyan-300/20"
      >
        <h1 className="text-3xl font-extrabold mb-4 text-cyan-300">🌊 WavePortal</h1>

        {!account && connectors && connectors.length > 0 && (
          <button
            onClick={async () => {
              try {
                console.log('Connectors:', connectors);
                connectors.forEach((c, i) => {
                  console.log(`Connector ${i}:`, c);
                });
                await connect({ connector: connectors[0] });
              } catch (err) {
                alert('Failed to connect wallet. Make sure you have a Starknet wallet extension (e.g., Argent X, Braavos) installed and unlocked.');
                console.error('Wallet connect error:', err);
              }
            }}
            className="bg-cyan-400/20 hover:bg-cyan-400/30 transition px-4 py-2 rounded-lg font-medium w-full mb-4"
          >
            Connect Wallet
          </button>
        )}
        {!account && (!connectors || connectors.length === 0) && (
          <div className="text-cyan-200 mb-4">No wallet connectors found.</div>
        )}

        {account && (
          <>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 rounded-lg bg-cyan-200/10 border border-cyan-200/20 resize-none mb-4 text-white placeholder:text-cyan-200/50"
              rows={3}
              placeholder="Your wave message..."
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
                  {txHash ? 'Confirming...' : 'Sending...'}
                </>
              ) : (
                '🌊 Send Wave'
              )}
            </button>
            
            {txHash && (
              <div className="mt-2 text-xs text-cyan-200 text-center">
                Transaction submitted! Waiting for confirmation...
              </div>
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

```