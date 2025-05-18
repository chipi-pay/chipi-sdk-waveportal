'use client';

import { useEffect, useState } from 'react';
import { Contract, RpcProvider, CallData } from 'starknet';
import { useAccount, useConnect } from '@starknet-react/core';
import abi from './WavePortal.abi.json';
import { motion } from 'framer-motion';

const CONTRACT_ADDRESS = '0x0638aa7782bfa69cbd9162fd3cfc086038dfc055fe200fe115a9b1c88b20b941';
const EVENT_KEY = '0x01b1d6c3fc5d2623b725e2a645cba4333d2b8bc1a81895c633380cff638b293f';

export default function Home() {
  const [message, setMessage] = useState('');
  const [waves, setWaves] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<string>('0');

  const { account } = useAccount();
  const { connectors, connect } = useConnect();

  const fetchWaves = async () => {
    try {
      const provider = new RpcProvider({ nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_8' });
      const latestBlock = await provider.getBlockLatestAccepted();
      const events = await provider.getEvents({
        address: CONTRACT_ADDRESS,
        keys: [[EVENT_KEY]],
        from_block: { block_number: 1410539 },
        to_block: { block_number: latestBlock.block_number },
        chunk_size: 20,
      });

      const messages: string[] = [];
      for (const e of events.events) {
        const rawData = e.data.slice(2);
        const decoded = rawData.map((b: string) => String.fromCharCode(Number(BigInt(b)))).join('');
        messages.push(decoded);
      }
      setWaves(messages.reverse());
      setTotal(messages.length.toString());
    } catch (err) {
      console.error('Error fetching waves:', err);
    }
  };

  const getTotalWaves = async () => {
    try {
      const provider = new RpcProvider({ nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_8' });
      const contract = new Contract(abi, CONTRACT_ADDRESS, provider);
      const result = await contract.call('total_waves', []);
      let count;
      if (typeof result === 'object' && result !== null && 'total_waves' in result) {
        count = result.total_waves;
      } else if (Array.isArray(result)) {
        count = result[0];
      } else {
        count = 0;
      }
      setTotal(BigInt(count).toString());
    } catch (err) {
      console.error('Error getting total waves:', err);
      setTotal('0');
    }
  };

  const sendWave = async () => {
    if (!account || !message) return;
    setLoading(true);
    try {
      const feltArr = Array.from(message).map((c) => BigInt(c.charCodeAt(0)));
      const calldata = CallData.compile({ message: feltArr });
  
      const res = await account.execute({
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: 'wave',
        calldata,
      });
  
      console.log('Wave sent:', res.transaction_hash);
      setMessage('');
      // Wait for transaction to be accepted
      setTimeout(() => {
        fetchWaves();
      }, 8000); // 8 seconds, adjust as needed
    } catch (err) {
      console.error('Error sending wave:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWaves();
    getTotalWaves();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-md bg-cyan-400/10 p-8 rounded-2xl shadow-2xl max-w-md w-full text-white border border-cyan-300/20"
      >
        <h1 className="text-3xl font-extrabold mb-4 text-cyan-300">🌊 WavePortal</h1>

        {!account && connectors && connectors.length > 0 && (
          <button
            onClick={async () => {
              try {
                console.log('Connectors:', connectors);
                connectors.forEach((c, i) => {
                  console.log(`Connector ${i}:`, c);
                });
                await connect({ connector: connectors[0] });
              } catch (err) {
                alert('Failed to connect wallet. Make sure you have a Starknet wallet extension (e.g., Argent X, Braavos) installed and unlocked.');
                console.error('Wallet connect error:', err);
              }
            }}
            className="bg-cyan-400/20 hover:bg-cyan-400/30 transition px-4 py-2 rounded-lg font-medium w-full mb-4"
          >
            Connect Wallet
          </button>
        )}
        {!account && (!connectors || connectors.length === 0) && (
          <div className="text-cyan-200 mb-4">No wallet connectors found.</div>
        )}

        {account && (
          <>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 rounded-lg bg-cyan-200/10 border border-cyan-200/20 resize-none mb-4 text-white placeholder:text-cyan-200/50"
              rows={3}
              placeholder="Your wave message..."
            />
            <button
              onClick={sendWave}
              disabled={loading}
              className="bg-cyan-400/20 hover:bg-cyan-400/30 transition px-4 py-2 rounded-lg font-medium w-full"
            >
              {loading ? 'Sending...' : '🌊 Send Wave'}
            </button>
          </>
        )}

        {total && (
          <p className="mt-4 text-cyan-100">Total waves: <strong>{total}</strong></p>
        )}
        <div className="mt-4 max-h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-cyan-400/30 scrollbar-track-transparent">
          {waves.map((wave, i) => (
            <div key={i} className="bg-cyan-400/10 p-2 rounded text-sm border border-cyan-200/20">
              {wave}
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
