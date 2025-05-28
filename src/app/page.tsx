'use client';

import WavePortalClient from './components/WavePortalClient';
import HomeContent from './HomeContent';

/**
 * WavePortal - A Simple Starknet App Template
 * 
 * This template demonstrates how to interact with Starknet blockchain:
 * - Connect your Starknet wallet (Argent X, Braavos)
 * - Send messages that are stored on-chain
 * - View messages from other users
 * 
 * The WavePortal Cairo contract:
 * - Records all messages as on-chain events
 * - Counts total waves sent
 * - Has a 21% chance to reward users with tokens when they wave
 */

export default function Page() {
  return (
    <WavePortalClient>
      <HomeContent />
    </WavePortalClient>
  );
}
