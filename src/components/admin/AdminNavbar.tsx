'use client'

import Link from 'next/link'
import { Menu, Bell, User } from 'lucide-react'

export default function AdminNavbar({ isOpen, onClose ,showicon}: { isOpen: boolean, onClose: () => void ,showicon: boolean }) {
  return (
    <header className="sticky  top-0 z-20 flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-6 shadow-sm">
      <button
        type="button"
        className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" onClick={onClose} />
      </button>
      <div className="flex flex-1 items-center justify-between">
        <h1 className="font-google text-lg font-semibold text-gray-800">
          Admin
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full p-1.5 text-gray-600 hover:bg-gray-100"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
