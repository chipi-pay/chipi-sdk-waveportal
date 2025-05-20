This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Step 1: Building the UI and the Smart Contract

### WavePortal - A Simple Starknet App Template

This template demonstrates how to interact with Starknet blockchain:
- Connect your Starknet wallet (Argent X, Braavos)
- Send messages that are stored on-chain
- View messages from other users

### The WavePortal Cairo Contract:
- Records all messages as on-chain events
- Counts total waves sent
- Has a 21% chance to reward users with tokens when they wave

## Step 2: Adding User Authentication with Clerk

In this step, we integrate Clerk to provide a seamless authentication experience:

### Authentication Features
- User sign-in and sign-up flow
- Social login options (Google, GitHub, etc.)
- Secure session management
- Protected routes for authenticated users

### Implementation Steps
1. Add Clerk's `<SignIn />` component to create a dedicated sign-in page
2. Configure authentication middleware to protect routes
3. Create an onboarding experience for new users

### Custom Onboarding Flow

The application implements a custom onboarding flow using Clerk's user management capabilities:

- **Session Token Customization**: We add a custom claim to track onboarding status in the user's session token
- **Public Metadata**: User onboarding progress is stored in the user's `publicMetadata` with an `onboardingComplete` flag
- **Middleware Protection**: Routes are protected based on authentication and onboarding status
- **Automatic Redirection**: Users who haven't completed onboarding are redirected to the onboarding page
- **Server Actions**: We use server-side actions to securely update user metadata upon onboarding completion

For detailed implementation, see Clerk's [Add Custom Onboarding](https://clerk.com/docs/references/nextjs/add-onboarding-flow) guide.

### Example Integration (Next.js)

```tsx
'use client'

import { SignIn, useUser } from '@clerk/nextjs'

export default function SignInPage() {
  return <SignIn />
}
```

For a deep dive into Clerk's authentication, check out:
- [Clerk Sign-In Documentation](https://clerk.com/docs/components/authentication/sign-in)
- [Adding Custom Onboarding](https://clerk.com/docs/components/authentication/custom-onboarding)
- [Middleware Configuration](https://clerk.com/docs/nextjs/middleware)

## Step 3: Integrating Chipi SDK for Invisible Wallets

In this step, we enhance the user experience by adding invisible wallet functionality using Chipi SDK:

### Key Features
- Generate Argent-compatible wallets for users without requiring a crypto wallet
- Store wallet credentials securely in Clerk user metadata
- Sponsor gas fees for all transactions using Avnu's paymaster
- Track growth metrics and user engagement in the ChipiPay dashboard

### Implementation Steps

1. **Setting up Chipi SDK Provider**

```tsx
'use client'

import { ChipiProvider } from "@chipi-pay/chipi-sdk";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChipiProvider appId={process.env.NEXT_PUBLIC_CHIPI_APP_ID}>
      {children}
    </ChipiProvider>
  );
}
```

2. **Creating Invisible Wallets**

```tsx
'use client'

import { useCreateWallet } from "@chipi-pay/chipi-sdk";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export function CreateWalletButton() {
  const { createWalletAsync, isLoading } = useCreateWallet();
  const { user } = useUser();
  const [pin, setPin] = useState('');
  
  const handleCreateWallet = async () => {
    try {
      // Create wallet with user's PIN
      const result = await createWalletAsync(pin);
      
      // Store wallet in Clerk metadata
      await user?.update({
        publicMetadata: {
          wallet: {
            address: result.accountAddress,
            // Don't store private keys in publicMetadata in production!
            // This is just for demonstration
          }
        }
      });
      
    } catch (error) {
      console.error("Failed to create wallet:", error);
    }
  };
  
  return (
    <div>
      <input 
        type="password" 
        placeholder="Set your PIN" 
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="px-4 py-2 border rounded-md mr-2"
      />
      <button
        onClick={handleCreateWallet}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {isLoading ? "Creating..." : "Create Wallet"}
      </button>
    </div>
  );
}
```

3. **Sponsoring Gas for Transactions**

With Chipi SDK, all transactions are automatically sponsored through Avnu's paymaster. This means:

- Users don't need ETH to pay for gas
- Transactions are executed seamlessly without wallet popups
- All gas fees are covered by your application

4. **Accessing Growth Analytics**

Monitor your application's performance and user engagement:

- Visit [dashboard.chipipay.com](https://dashboard.chipipay.com) to access your metrics
- Track wallet creation, transaction volume, and user activity
- Analyze growth trends and optimize your application

### Storage in Clerk Metadata

Clerk's user metadata provides a secure way to associate wallet addresses with user profiles:

```typescript
// Server action to securely retrieve user's wallet
async function getUserWallet(userId: string) {
  const user = await clerkClient.users.getUser(userId);
  return user.publicMetadata.wallet;
}

// Server action to update wallet information
async function updateWalletMetadata(userId: string, walletData: any) {
  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      wallet: walletData
    }
  });
}
```

For more detailed implementation, visit [sdkdocs.chipipay.com](https://sdkdocs.chipipay.com).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.