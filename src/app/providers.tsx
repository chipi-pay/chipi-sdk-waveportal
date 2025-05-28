'use client';
import { ChipiProvider } from "@chipi-pay/chipi-sdk";

// All environment variables should be prefixed with NEXT_PUBLIC_ for client-side access
const CHIPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_CHIPI_PUBLIC_KEY;

if (!CHIPI_PUBLIC_KEY) {
  console.error('Missing environment variables:', {
    CHIPI_PUBLIC_KEY: !!CHIPI_PUBLIC_KEY,
  });
  throw new Error("Some Key is not set");
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChipiProvider
      config={{
        apiPublicKey: CHIPI_PUBLIC_KEY,
      }}
    >
      {children}
    </ChipiProvider>
  );
}