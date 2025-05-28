import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const walletCreated = session?.sessionClaims?.metadata?.walletCreated

  if (walletCreated === true) {
    redirect('/')
  }

  return <>{children}</>
}