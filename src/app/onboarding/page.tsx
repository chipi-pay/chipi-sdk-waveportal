"use client";

import * as React from "react";
import dynamic from 'next/dynamic';

const WavePortalClient = dynamic(
  () => import('../components/WavePortalClient'),
  { ssr: false }
);
const OnboardingForm = dynamic(
  () => import('./OnboardingForm'),
  { ssr: false }
);

export default function OnboardingPage() {
  return (
    <WavePortalClient>
      <OnboardingForm />
    </WavePortalClient>
  );
}