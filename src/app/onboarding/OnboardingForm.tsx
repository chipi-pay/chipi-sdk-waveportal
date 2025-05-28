"use client";

import * as React from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCreateWallet } from "@chipi-pay/chipi-sdk";
import { completeOnboarding } from "./_actions";

export default function OnboardingForm() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const { createWalletAsync, isLoading, isError } = useCreateWallet();

  const handleSubmit = async (formData: FormData) => {
    const token = await getToken({ template: "payot-io" });
    console.log(token);
    if (!token) {
      throw new Error("No token found");
    }

    try {
      const pin = formData.get('pin') as string;
      if (!pin || pin.trim() === '') {
        throw new Error('PIN is required');
      }
      if (!/^\d+$/.test(pin)) {
        throw new Error('PIN must contain only numbers');
      }
      console.log('Creating wallet...');
      const response = await createWalletAsync({ encryptKey: "1234", bearerToken: token });
      console.log('Wallet creation response:', response);
      if (!response.success || !response.wallet) {
        throw new Error('Failed to create wallet');
      }
      console.log('Updating Clerk metadata...');
      const result = await completeOnboarding({
        publicKey: response.wallet.publicKey,
        encryptedPrivateKey: response.wallet.encryptedPrivateKey,
      });
      console.log('Clerk update result:', result);
      if (result.error) {
        throw new Error(result.error);
      }
      await user?.reload();
      router.push("/");
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  }

  if (isLoading) {
    return <div>Creating wallet...</div>;
  }
  if (isError) {
    return <div>Error creating wallet</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-md bg-cyan-400/10 p-8 rounded-2xl shadow-2xl max-w-md w-full text-white border border-cyan-300/20"
      >
        <h1 className="text-3xl font-extrabold mb-4 text-cyan-300">🌊 Onboarding</h1>
        <form action={handleSubmit}>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-cyan-100">Enter your PIN</label>
              <p className="text-xs text-cyan-200/70">This PIN will be used to create your wallet and encrypt your private key.</p>
              <input
                type="password"
                name="pin"
                inputMode="numeric"
                pattern="[0-9]{4}"
                minLength={4}
                maxLength={4}
                required
                className="mt-2 w-full px-3 py-2 bg-cyan-200/10 border border-cyan-200/20 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-300 focus:border-cyan-300 text-white"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-2 bg-cyan-400/20 hover:bg-cyan-400/30 transition text-white rounded-lg font-medium"
          >
            Submit
          </button>
        </form>
      </motion.div>
    </main>
  );
} 