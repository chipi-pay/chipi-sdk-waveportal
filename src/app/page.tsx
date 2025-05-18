// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Contract, RpcProvider } from 'starknet';
import abi from './WavePortal.abi.json';
import { motion } from 'framer-motion';

const CONTRACT_ADDRESS = '0x0638aa7782bfa69cbd9162fd3cfc086038dfc055fe200fe115a9b1c88b20b941';
const EVENT_SELECTOR = '0x01b1d6c3fc5d2623b725e2a645cba4333d2b8bc1a81895c633380cff638b293f';

export default function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [waves, setWaves] = useState<string[]>([]);

  const provider = new RpcProvider({ nodeUrl: 'https://starknet-mainnet.public.blastapi.io' });

  const fetchWaves = async () => {
    try {
      const latestBlock = await provider.getBlockLatestAccepted();
      const result = await provider.getEvents({
        address: CONTRACT_ADDRESS,
        keys: [[EVENT_SELECTOR]],
        from_block: { block_number: 1410539 },
        to_block: { block_number: latestBlock.block_number },
        chunk_size: 20,
      });
      const messages = result.events.map((evt: any) => {
        const data = evt.data?.slice(2) || [];
        try {
          return String.fromCharCode(...data.map((b: any) => Number(BigInt(b))));
        } catch (e) {
          return '[Invalid Encoding]';
        }
      });
      setWaves(messages.reverse());
      setTotal(messages.length);
    } catch (e) {
      console.error('Error fetching waves:', e);
    }
  };

  useEffect(() => {
    fetchWaves();
  }, []);

  const handleWave = async () => {
    alert('Wallet connection not implemented. Please integrate get-starknet or similar.');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-md bg-cyan-400/10 p-8 rounded-2xl shadow-2xl max-w-xl w-full text-white border border-cyan-300/20"
      >
        <h1 className="text-3xl font-extrabold mb-4 text-cyan-300">🌊 WavePortal</h1>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 rounded-lg bg-cyan-200/10 border border-cyan-200/20 resize-none mb-4 text-white placeholder:text-cyan-200/50"
          rows={3}
          placeholder="Send your wave message..."
        />
        <button
          onClick={handleWave}
          disabled={loading}
          className="w-full bg-cyan-400/20 hover:bg-cyan-400/30 transition px-4 py-2 rounded-lg font-medium mb-4"
        >
          {loading ? 'Sending...' : '🌊 Send Wave'}
        </button>
        <p className="mb-2 text-cyan-100">Total waves: <strong>{total}</strong></p>
        <div className="max-h-96 overflow-y-auto space-y-2">
          {waves.map((msg, i) => (
            <div
              key={i}
              className="bg-white/10 text-white p-3 rounded-lg border border-cyan-300/10 shadow-md"
            >
              📝 {msg}
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
