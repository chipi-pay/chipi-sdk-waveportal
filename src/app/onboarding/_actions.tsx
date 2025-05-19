'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

interface WalletData {
  publicKey: string;
  encryptedPrivateKey: string;
}

export const completeOnboarding = async (walletData: WalletData) => {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: 'No Logged In User' }
    }

    const client = await clerkClient()

    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        walletCreated: true,
        publicKey: walletData.publicKey,
        encryptedPrivateKey: walletData.encryptedPrivateKey,
      },
    })

    return { success: true, metadata: res.publicMetadata }
  } catch (err) {
    console.error('Server: Error in completeOnboarding:', err)
    return { error: err instanceof Error ? err.message : 'There was an error updating the user metadata.' }
  }
}