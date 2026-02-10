'use client'

import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import {useState }from 'react'

export default function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showicon, setShowicon] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar isOpen={isSidebarOpen} showicon={showicon} onClose={() => {setIsSidebarOpen(!isSidebarOpen) ; setShowicon(!showicon)}} />
      <div className="md:pl-56">
        <AdminNavbar isOpen={isSidebarOpen} showicon={showicon} onClose={() => {setIsSidebarOpen(!isSidebarOpen) ;setShowicon(!showicon)}} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
