"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
// Import the server action that will update user metadata
// import { completeOnboarding } from "./_actions";

export default function OnboardingComponent() {
  // Access the current user's data
  const { user } = useUser();
  const router = useRouter();
  
  // This function handles the form submission
  // In a complete implementation, this would:
  // 1. Collect user data from the form
  // 2. Call the completeOnboarding server action to update user's publicMetadata
  // 3. Set onboardingComplete: true in the user's publicMetadata
  // 4. Reload the user data to refresh session claims
  // 5. Redirect to the main application page
  const handleSubmit = async (formData: FormData) => {
    // In a real implementation, you would update user metadata with something like:
    // const result = await completeOnboarding(formData);
    
    // Reload user data to refresh the session claims
    await user?.reload();
    // Redirect to the main page after successful onboarding
    router.push("/");
    console.log(formData);
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
                type="number"
                name="pin"
                pattern="\d*"
                minLength={6}
                maxLength={6}
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
  )
}