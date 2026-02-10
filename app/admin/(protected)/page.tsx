'use client'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useGetDashboardDataQuery } from "@/src/features/general/general.slice"

export default function AdminPage() {
  const { data, isLoading, error } = useGetDashboardDataQuery()

  const totals = data && 'totals' in data ? data.totals : undefined

  return (
    <div className="font-raleway">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-google text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
          Welcome to the admin panel. Manage submissions and users from the sidebar.
        </p>
      </div>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium text-gray-900 text-sm sm:text-base">Submissions</h3>
          <p className="mt-2 text-xl sm:text-2xl font-semibold text-[#ee7c2b]">
            {isLoading ? (
              <Skeleton width={40} height={28} className="sm:w-12 sm:h-8" />
            ) : error ? (
              '—'
            ) : (
              totals?.submissions ?? '—'
            )}
          </p>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">Total food submissions</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium text-gray-900 text-sm sm:text-base">Users</h3>
          <p className="mt-2 text-xl sm:text-2xl font-semibold text-[#ee7c2b]">
            {isLoading ? (
              <Skeleton width={40} height={28} className="sm:w-12 sm:h-8" />
            ) : error ? (
              '—'
            ) : (
              totals?.users ?? '—'
            )}
          </p>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">Registered users</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <h3 className="font-medium text-gray-900 text-sm sm:text-base">Images</h3>
          <p className="mt-2 text-xl sm:text-2xl font-semibold text-[#ee7c2b]">
            {isLoading ? (
              <Skeleton width={40} height={28} className="sm:w-12 sm:h-8" />
            ) : error ? (
              '—'
            ) : (
              totals?.images ?? '—'
            )}
          </p>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">Total images uploaded</p>
        </div>
      </div>
    </div>
  )
}
