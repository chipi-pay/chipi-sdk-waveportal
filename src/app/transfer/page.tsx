"use client";

import WavePortalClient from '../components/WavePortalClient';
import TransferForm from './TransferForm';

export default function TransferPage() {
  return (
    <WavePortalClient>
      <TransferForm />
    </WavePortalClient>
  );
}