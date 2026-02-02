'use client'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useGetDashboardDataQuery } from "@/src/features/general/general.slice"

export default function AdminPage() {
  const { data, isLoading, error } = useGetDashboardDataQuery()

  const totals = data && 'totals' in data ? data.totals : undefined

  return (
    <div className="font-raleway">
      <h1 className="mb-2 font-google text-2xl font-semibold text-gray-900">
        Dashboard
      </h1>
      <p className="mb-6 text-gray-600">
        Welcome to the admin panel. Manage submissions and users from the sidebar.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-medium text-gray-900">Submissions</h3>
          <p className="mt-1 text-2xl font-semibold text-[#ee7c2b]">
            {isLoading ? (
              <Skeleton width={48} height={32} />
            ) : error ? (
              '—'
            ) : (
              totals?.submissions ?? '—'
            )}
          </p>
          <p className="mt-1 text-sm text-gray-500">Total food submissions</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-medium text-gray-900">Users</h3>
          <p className="mt-1 text-2xl font-semibold text-[#ee7c2b]">
            {isLoading ? (
              <Skeleton width={48} height={32} />
            ) : error ? (
              '—'
            ) : (
              totals?.users ?? '—'
            )}
          </p>
          <p className="mt-1 text-sm text-gray-500">Registered users</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-medium text-gray-900">Images</h3>
          <p className="mt-1 text-2xl font-semibold text-[#ee7c2b]">
            {isLoading ? (
              <Skeleton width={48} height={32} />
            ) : error ? (
              '—'
            ) : (
              totals?.images ?? '—'
            )}
          </p>
          <p className="mt-1 text-sm text-gray-500">Total images</p>
        </div>
      </div>
    </div>
  )
}
