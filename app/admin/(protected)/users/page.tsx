'use client'

import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import UsersTable from '@/src/components/tables/UsersTable'

export default function AdminUsersPage() {
  return (
    <div className="font-raleway">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-google text-2xl font-semibold text-gray-900">
            Users
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage users who can access the admin portal.
          </p>
        </div>
        <Link
          href="/admin/adduser"
          className="inline-flex items-center gap-2 rounded-lg bg-[#ee7c2b] px-4 py-2.5 font-medium text-white hover:bg-[#d66a1f] transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          Add user
        </Link>
      </div>

      <UsersTable />
    </div>
  )
}
