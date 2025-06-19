// app/providers.tsx
"use client";

import { ChipiProvider } from "@chipi-pay/chipi-sdk";

export function Providers({ children }: { children: React.ReactNode }) {
  const apiPublicKey = process.env.NEXT_PUBLIC_CHIPI_API_KEY;

  if (!apiPublicKey) {
    console.warn("NEXT_PUBLIC_CHIPI_API_KEY is not set. Please add it to your environment variables.");
    // Return children without ChipiProvider if API key is missing
    return <>{children}</>;
  }

  return (
    <ChipiProvider
      config={{
        apiPublicKey,
      }}
    >
      {children}
    </ChipiProvider>
  );
}