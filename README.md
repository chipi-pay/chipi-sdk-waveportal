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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.