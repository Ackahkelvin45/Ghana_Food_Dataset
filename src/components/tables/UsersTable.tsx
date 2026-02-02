'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import { UserPlus, Pencil, Trash2 } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useGetUsersQuery } from '@/src/features/users/users.slice'

export type UserRow = {
  id: number
  fullName: string
  email: string
  userType: string
  phone: string | null
  createdAt: string
  updatedAt: string
}

const USER_QUERY_KEY = 'users'

function UsersTable() {
  const queryClient = useQueryClient()
  const { data: users, isLoading, isError, error } = useGetUsersQuery()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const rows: UserRow[] = Array.isArray(users)
    ? users.map(
        (u: {
          id: number
          fullName: string
          email: string
          userType: string
          phone: string | null
          createdAt: string
          updatedAt: string
        }) => ({
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          userType: u.userType,
          phone: u.phone ?? null,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        })
      )
    : []

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    setDeletingId(id)
    try {
      const res = await fetch('/api/user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] })
      }
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return '—'
    }
  }

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-600">Name</th>
                <th className="px-6 py-3 font-medium text-gray-600">Email</th>
                <th className="px-6 py-3 font-medium text-gray-600">Role</th>
                <th className="px-6 py-3 font-medium text-gray-600">Phone</th>
                <th className="px-6 py-3 font-medium text-gray-600">Created</th>
                <th className="px-6 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-6 py-4">
                    <Skeleton width={120} height={20} />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton width={160} height={20} />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton width={56} height={22} borderRadius={9999} />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton width={90} height={20} />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton width={80} height={20} />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton width={48} height={20} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error instanceof Error ? error.message : 'Failed to load users.'}
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12 text-center shadow-sm">
        <p className="text-gray-500">No users yet.</p>
        <Link
          href="/admin/adduser"
          className="mt-3 inline-flex items-center gap-2 text-[#ee7c2b] hover:underline"
        >
          <UserPlus className="h-4 w-4" />
          Add user
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">
                Name
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Email
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Role
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Phone
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Created
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50/50"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {user.fullName}
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.userType === 'ADMIN'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.userType}
                  </span>
                </td>
                <td className="px-6 py-4">{user.phone ?? '—'}</td>
                <td className="px-6 py-4 text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-gray-600 hover:text-[#ee7c2b]"
                      aria-label="Edit user"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                      className="inline-flex items-center gap-1 text-gray-600 hover:text-red-600 disabled:opacity-50"
                      aria-label="Delete user"
                    >
                      {deletingId === user.id ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsersTable
