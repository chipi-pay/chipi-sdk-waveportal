'use client';
import { ChipiProvider } from "@chipi-pay/chipi-sdk";

// All environment variables should be prefixed with NEXT_PUBLIC_ for client-side access
const CHIPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_CHIPI_PUBLIC_KEY!;
const CHIPI_APP_ID = process.env.NEXT_PUBLIC_CHIPI_APP_ID!;
const CHIPI_SECRET_KEY = process.env.NEXT_PUBLIC_CHIPI_SECRET_KEY!;


if (!CHIPI_PUBLIC_KEY || !CHIPI_APP_ID || !CHIPI_SECRET_KEY) {
  console.error('Missing environment variables:', {
    CHIPI_PUBLIC_KEY: !!CHIPI_PUBLIC_KEY,
    CHIPI_APP_ID: !!CHIPI_APP_ID,
    CHIPI_SECRET_KEY: !!CHIPI_SECRET_KEY
  });
  throw new Error("Some Key is not set");
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChipiProvider
      config={{
        apiKey: CHIPI_PUBLIC_KEY,
        secretKey: CHIPI_SECRET_KEY,
        appId: CHIPI_APP_ID
      }}
    >
      {children}
    </ChipiProvider>
  );
}