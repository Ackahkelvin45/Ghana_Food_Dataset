'use client'

import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="md:pl-56">
        <AdminNavbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
