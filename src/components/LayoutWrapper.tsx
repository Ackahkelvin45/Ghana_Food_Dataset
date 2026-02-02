'use client'

import { usePathname } from 'next/navigation'
import NavBar from '@/src/components/NavBar'
import AdminShell from '@/src/components/admin/AdminShell'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <AdminShell>{children}</AdminShell>
  }

  return (
    <>
      <NavBar />
      <div className="w-full bg-white">{children}</div>
    </>
  )
}
