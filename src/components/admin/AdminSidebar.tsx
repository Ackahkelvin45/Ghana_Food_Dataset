'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  ImagePlus,
  Users,
  Settings,
  Home,
  LogOut,
  CircleX
} from 'lucide-react'
import LogoutModal from '@/src/components/modal/Logoutmodal'


const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/submissions', label: 'Submissions', icon: ImagePlus },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar({ isOpen, onClose ,showicon}: { isOpen: boolean, onClose: () => void ,showicon: boolean }) {
  const pathname = usePathname()
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut({ callbackUrl: '/login' })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <aside className={`fixed left-0 top-0 z-30  h-screen w-56 ${isOpen ? 'translate-x-0' : 'md:translate-x-0 -translate-x-full'} transition-all duration-300 ease-in-out flex-col border-r border-gray-200 bg-gray-50 md:flex`}>
      <div className="flex h-14 items-center justify-between border-b border-gray-200 px-6">
        <Link href="/admin" className="font-google text-lg font-semibold text-gray-800">
          Ghana Food
        </Link>


{
  showicon && (
    <button onClick={onClose}>
        <CircleX className="h-5 w-5 shrink-0" />
    </button>
  )
}


      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
        >
          <Home className="h-5 w-5 shrink-0 font-google" />
          Back to site
        </Link>
        <div className="my-2 border-t font-google  border-gray-200 pt-2" />
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center my-4 gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-[#ee7c2b] font-medium text-white'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          )
        })}
        <div className="my-2 border-t border-gray-200 pt-2" />
        <button
          type="button"
          onClick={() => setLogoutModalOpen(true)}
          className="flex w-full items-center gap-3 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Sign out
        </button>
      </nav>

      <LogoutModal
        isOpen={logoutModalOpen}
        onOpenChange={setLogoutModalOpen}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </aside>
  )
}
