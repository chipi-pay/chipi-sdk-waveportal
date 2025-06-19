// app/providers.tsx
"use client";

import { ChipiProvider } from "@chipi-pay/chipi-sdk";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChipiProvider
      config={{
        apiPublicKey: process.env.NEXT_PUBLIC_CHIPI_API_KEY,
      }}
    >
      {children}
    </ChipiProvider>
  );
}