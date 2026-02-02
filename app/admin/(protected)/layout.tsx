import type { ReactNode } from 'react'
import AuthGaurd from '@/src/components/AuthGaurd'

export default function AdminProtectedLayout({
  children,
}: {
  children: ReactNode
}) {
  return <AuthGaurd>{children}</AuthGaurd>
}
