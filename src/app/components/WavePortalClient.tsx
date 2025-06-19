'use client';
import { ChipiProvider } from '@chipi-pay/chipi-sdk';

export default function WavePortalClient({ children }: { children: React.ReactNode }) {
  return (
    <ChipiProvider config={{ apiPublicKey: process.env.NEXT_PUBLIC_CHIPI_PUBLIC_KEY }}>
      {children}
    </ChipiProvider>
  );
}