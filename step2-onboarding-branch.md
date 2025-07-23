Project Path: chipi-sdk-waveportal

Source Tree:

```txt
chipi-sdk-waveportal
└── src
    ├── app
    │   ├── StarknetProviderWrapper.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── onboarding
    │   │   └── page.tsx
    │   ├── page.tsx
    │   └── sign-in
    │       └── [[...sign-in]]
    │           └── page.tsx
    └── middleware.tsx

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
import {
  ClerkProvider,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

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
      <ClerkProvider signInFallbackRedirectUrl="/" signUpFallbackRedirectUrl="/" afterSignOutUrl="/">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
          <header className="flex items-center h-20 gap-4 px-4 border-b border-cyan-300 border-solid sm:px-8 border-opacity-20">
            <Link href="/" className="flex items-center h-20 gap-2 sm:gap-4">
              <span className="text-xl font-bold text-cyan-300">🌊 WavePortal</span>
            </Link>
            <div className="grow" />

            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>

          <main className="grow">
            <StarknetProviderWrapper>
              {children}
            </StarknetProviderWrapper>
          </main>

          <footer className="flex items-center h-20 gap-1 px-8 font-medium border-t border-cyan-300 border-opacity-20 md:px-20">
            <a
              className="flex gap-2 px-3 py-2 text-m font-semibold text-cyan-500 transition duration-100 rounded-md hover:text-cyan-300"
              href="https://github.com/chipi-pay/waveportal-app"
            >
              <span className="hidden sm:inline">View the Github Repo for this Chipi-SDK template</span>
            </a>

            <nav className="flex justify-end grow sm:gap-2">
              <a
                className="flex gap-2 px-3 py-2 text-sm font-semibold text-cyan-500 transition duration-100 rounded-md hover:text-cyan-300"
                href="https://sdkdocs.chipipay.com/"
              >
                <div className="m-auto">
                  <Docs />
                </div>
                <span className="hidden sm:inline"> Visit Chipi-SDK Docs</span>
              </a>
              <a
                className="flex gap-2 px-3 py-2 text-sm font-semibold text-cyan-500 transition duration-100 rounded-md hover:text-cyan-300"
                href="https://github.com/chipi-pay"
              >
                <div className="m-auto">
                  <Github />
                </div>
              </a>
              <a
                className="flex flex-col justify-center p-2 hover:text-cyan-300 text-cyan-500"
                href="https://twitter.com/hichipipay"
              >
                <Twitter />
              </a>
            </nav>
          </footer>
        </body>
      </ClerkProvider>
    </html>
  );
}

function Docs() {
  return (
    <svg
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.99999 16.5L9.91661 16.3749C9.33774 15.5066 9.04831 15.0725 8.66591 14.7582C8.32737 14.4799 7.93729 14.2712 7.51799 14.1438C7.04437 14 6.52258 14 5.47901 14H4.33332C3.3999 14 2.93319 14 2.57667 13.8183C2.26307 13.6586 2.0081 13.4036 1.84831 13.09C1.66666 12.7335 1.66666 12.2668 1.66666 11.3333V4.16667C1.66666 3.23325 1.66666 2.76654 1.84831 2.41002C2.0081 2.09641 2.26307 1.84144 2.57667 1.68166C2.93319 1.5 3.3999 1.5 4.33332 1.5H4.66666C6.5335 1.5 7.46692 1.5 8.17996 1.86331C8.80717 2.18289 9.3171 2.69282 9.63668 3.32003C9.99999 4.03307 9.99999 4.96649 9.99999 6.83333M9.99999 16.5V6.83333M9.99999 16.5L10.0834 16.3749C10.6622 15.5066 10.9517 15.0725 11.3341 14.7582C11.6726 14.4799 12.0627 14.2712 12.482 14.1438C12.9556 14 13.4774 14 14.521 14H15.6667C16.6001 14 17.0668 14 17.4233 13.8183C17.7369 13.6586 17.9919 13.4036 18.1517 13.09C18.3333 12.7335 18.3333 12.2668 18.3333 11.3333V4.16667C18.3333 3.23325 18.3333 2.76654 18.1517 2.41002C17.9919 2.09641 17.7369 1.84144 17.4233 1.68166C17.0668 1.5 16.6001 1.5 15.6667 1.5H15.3333C13.4665 1.5 12.5331 1.5 11.82 1.86331C11.1928 2.18289 10.6829 2.69282 10.3633 3.32003C9.99999 4.03307 9.99999 4.96649 9.99999 6.83333"
        stroke="#0891b2"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Github() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 0.25C4.16562 0.25 0.25 4.16562 0.25 9C0.25 12.8719 2.75469 16.1422 6.23281 17.3016C6.67031 17.3781 6.83437 17.1156 6.83437 16.8859C6.83437 16.6781 6.82344 15.9891 6.82344 15.2563C4.625 15.6609 4.05625 14.7203 3.88125 14.2281C3.78281 13.9766 3.35625 13.2 2.98438 12.9922C2.67812 12.8281 2.24063 12.4234 2.97344 12.4125C3.6625 12.4016 4.15469 13.0469 4.31875 13.3094C5.10625 14.6328 6.36406 14.2609 6.86719 14.0312C6.94375 13.4625 7.17344 13.0797 7.425 12.8609C5.47813 12.6422 3.44375 11.8875 3.44375 8.54062C3.44375 7.58906 3.78281 6.80156 4.34062 6.18906C4.25313 5.97031 3.94687 5.07344 4.42812 3.87031C4.42812 3.87031 5.16094 3.64063 6.83437 4.76719C7.53438 4.57031 8.27813 4.47187 9.02188 4.47187C9.76563 4.47187 10.5094 4.57031 11.2094 4.76719C12.8828 3.62969 13.6156 3.87031 13.6156 3.87031C14.0969 5.07344 13.7906 5.97031 13.7031 6.18906C14.2609 6.80156 14.6 7.57812 14.6 8.54062C14.6 11.8984 12.5547 12.6422 10.6078 12.8609C10.925 13.1344 11.1984 13.6594 11.1984 14.4797C11.1984 15.65 11.1875 16.5906 11.1875 16.8859C11.1875 17.1156 11.3516 17.3891 11.7891 17.3016C13.5261 16.7152 15.0355 15.5988 16.1048 14.1096C17.1741 12.6204 17.7495 10.8333 17.75 9C17.75 4.16562 13.8344 0.25 9 0.25Z"
        fill="#0891b2"
      />
    </svg>
  );
}

function Twitter() {
  return (
    <svg
      width="19"
      height="15"
      viewBox="0 0 19 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.36796 14.5C4.34609 14.5 2.46136 13.9119 0.875 12.8973C2.22187 12.9844 4.59879 12.7757 6.07724 11.3655C3.85317 11.2634 2.85016 9.55768 2.71934 8.82873C2.90831 8.90162 3.80956 8.9891 4.31834 8.78499C1.75994 8.14351 1.36745 5.89833 1.45467 5.21311C1.93437 5.54843 2.74841 5.66506 3.06821 5.6359C0.684246 3.93015 1.54189 1.36422 1.96345 0.810218C3.67426 3.18042 6.23825 4.51161 9.41024 4.58565C9.35043 4.32335 9.31885 4.05026 9.31885 3.76978C9.31885 1.75682 10.9459 0.125 12.9529 0.125C14.0016 0.125 14.9465 0.570471 15.6098 1.28302C16.3106 1.11882 17.3652 0.734417 17.8808 0.402003C17.6209 1.33507 16.8118 2.11343 16.3224 2.40192C16.3185 2.39207 16.3265 2.41174 16.3224 2.40192C16.7523 2.3369 17.9155 2.11336 18.375 1.8016C18.1478 2.32578 17.29 3.19733 16.5861 3.68526C16.717 9.46129 12.2978 14.5 6.36796 14.5Z"
        fill="#0891b2"
      />
    </svg>
  );
}

```

`chipi-sdk-waveportal/src/app/onboarding/page.tsx`:

```tsx
"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
// Import the server action that will update user metadata
// import { completeOnboarding } from "./_actions";

export default function OnboardingComponent() {
  // Access the current user's data
  const { user } = useUser();
  const router = useRouter();
  
  // This function handles the form submission
  // In a complete implementation, this would:
  // 1. Collect user data from the form
  // 2. Call the completeOnboarding server action to update user's publicMetadata
  // 3. Set onboardingComplete: true in the user's publicMetadata
  // 4. Reload the user data to refresh session claims
  // 5. Redirect to the main application page
  const handleSubmit = async (formData: FormData) => {
    // In a real implementation, you would update user metadata with something like:
    // const result = await completeOnboarding(formData);
    
    // Reload user data to refresh the session claims
    await user?.reload();
    // Redirect to the main page after successful onboarding
    router.push("/");
    console.log(formData);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-md bg-cyan-400/10 p-8 rounded-2xl shadow-2xl max-w-md w-full text-white border border-cyan-300/20"
      >
        <h1 className="text-3xl font-extrabold mb-4 text-cyan-300">🌊 Onboarding</h1>
        
        <form action={handleSubmit}>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-cyan-100">Enter your PIN</label>
              <p className="text-xs text-cyan-200/70">This PIN will be used to create your wallet and encrypt your private key.</p>
              <input
                type="password"
                name="pin"
                inputMode="numeric"
                pattern="[0-9]{4}"
                minLength={4}
                maxLength={4}
                required
                className="mt-2 w-full px-3 py-2 bg-cyan-200/10 border border-cyan-200/20 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-300 focus:border-cyan-300 text-white"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-2 bg-cyan-400/20 hover:bg-cyan-400/30 transition text-white rounded-lg font-medium"
          >
            Submit
          </button>
        </form>
      </motion.div>
    </main>
  )
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
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

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
  const { isSignedIn } = useUser();
  const router = useRouter();

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

        {!isSignedIn ? (
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-cyan-400/20 hover:bg-cyan-400/30 transition px-4 py-2 rounded-lg font-medium w-full mb-4"
          >
            Sign-in
          </button>
        ) : (
          <>
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

`chipi-sdk-waveportal/src/app/sign-in/[[...sign-in]]/page.tsx`:

```tsx
import { SignIn } from '@clerk/nextjs'

// Clerk Sign In/Sign Up Page : https://clerk.com/docs/components/authentication/sign-in

export default function Page() {
  return <SignIn />
}
```

`chipi-sdk-waveportal/src/middleware.tsx`:

```tsx
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/onboarding"])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // If the user is logged in and the route is protected, let them view.
  if (userId && !isPublicRoute(req)) {
    return NextResponse.next();
  }

});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```