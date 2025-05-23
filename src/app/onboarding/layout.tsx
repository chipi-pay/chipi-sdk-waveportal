import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  if ((await auth()).sessionClaims?.metadata.walletCreated === true) {
    redirect('/')
  }

  return <>{children}</>
}