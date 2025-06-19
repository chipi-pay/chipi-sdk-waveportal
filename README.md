# 🌊 WavePortal - Chipi SDK - Step 1: UI \& Blockchain Messaging

Welcome to the **step1-ui** branch of WavePortal!
This template shows how to build a simple, production-ready Starknet app using Next.js and Chipi SDK.

---

## 🚀 What’s Included

- **Connect your Starknet wallet** (Argent X, Braavos)
- **Send messages ("waves")** on-chain
- **View all on-chain messages** and live counter
- **Auto-refresh** and confetti feedback on success
- **Modern UI** with Tailwind, Framer Motion, and best practices

---

## 🗂️ Project Structure

```
src/app/
├── StarknetProviderWrapper.tsx  # Starknet wallet/provider setup
├── globals.css                  # Tailwind global styles
├── layout.tsx                   # Main layout (applies providers)
└── page.tsx                     # WavePortal UI and logic
```


---

## ⚡ Getting Started

1. **Clone the repo and checkout the branch:**

```bash
git clone -b step1-ui https://github.com/chipi-pay/chipi-sdk-waveportal.git
cd chipi-sdk-waveportal
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run locally:**

```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## 🦾 How it Works

- The app uses [@starknet-react/core](https://apibara.github.io/starknet-react/) to connect to Starknet wallets.
- When you send a message, it’s encoded and sent as a transaction to the WavePortal contract on Starknet.
- All messages are fetched from on-chain events and displayed in real time.

---

## 🧩 Key Files

### `src/app/StarknetProviderWrapper.tsx`

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


---

### `src/app/layout.tsx`

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


---

### `src/app/page.tsx`

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

export default function Home() {
  // ...see full code in repo
}
```


---

## 📝 Smart Contract Prompt Example

Use this prompt with ChatGPT, Claude, or ChainGPT to generate a Cairo contract for Starknet:

```
I'm creating a smart contract in Cairo for Starknet called WavePortal.
Requirements:
- Allow any user to send a public message ("wave")
- Store each message and emit an event for each
- Keep a total message count
- Functions to query all messages and the total
- (Optional) 21% chance to reward tokens to the user
- Well-commented and secure code
```


---

## 🧪 Testing

- Use [Argent X](https://www.argent.xyz/argent-x/) or [Braavos](https://braavos.app/) wallet extensions.
- Connect your wallet, send a message, and see it appear on-chain!

---

## 🚀 Deploy to Vercel

1. [Create an account on Vercel](https://vercel.com/)
2. Import this repo and select the `step1-ui` branch
3. Set up environment variables if needed
4. Deploy and share your live URL

---

## 📚 Resources

- [Chipi SDK Docs](https://docs.chipipay.com/)
- [Starknet React Docs](https://apibara.github.io/starknet-react/)
- [Official Repo](https://github.com/chipi-pay/chipi-sdk-waveportal)
- [Prompt Library: Blockchain Devs](https://www.aizapbox.com/prompt-library/50-ai-prompts-blockchain-developers)
- [Twitter](https://twitter.com/hichipipay)
- [Linktree](https://linktr.ee/diosplan)

---

## ❓ Questions or Suggestions?

Open an issue, DM [@hichipipay](https://twitter.com/hichipipay), or fork and share your version!

---

**Happy shipping!**

<div style="text-align: center">⁂</div>

[^1]: step1-ui-branch.md

[^2]: main-branch.md

[^3]: step2-onboarding-branch.md

