'use client'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useGetDashboardDataQuery } from "@/src/features/general/general.slice"

const DISH_LABELS: Record<string, string> = {
  YAM: "Yam",
  PLANTAIN: "Plantain (boiled)",
  KENKEY: "Kenkey",
  BANKU: "Banku",
  KOKONTE: "Kokonte",
  FUFU: "Fufu",
  JOLLOF: "Jollof",
  PLAIN_RICE: "Plain Rice",
  WAAKYE: "Waakye",
  BREAD: "Bread",
  KOKO: "Koko",
  BEANS: "Beans (Gob3)",
}

export default function AdminPage() {
  const { data, isLoading, error } = useGetDashboardDataQuery()

  const totals = data && 'totals' in data ? (data as any).totals : undefined
  const submissionsByClass = data && 'submissionsByClass' in data ? (data as any).submissionsByClass as Record<string, number> : undefined
  const imagesByClass = data && 'imagesByClass' in data ? (data as any).imagesByClass as Record<string, number> : undefined

  const classEntries =
    submissionsByClass && imagesByClass
      ? Object.keys(submissionsByClass)
          .sort()
          .map((key) => ({
            key,
            label: DISH_LABELS[key] ?? key,
            submissions: submissionsByClass[key] ?? 0,
            images: imagesByClass[key] ?? 0,
          }))
      : []

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

      {/* Totals by food class */}
      <div className="mt-8 sm:mt-10">
        <h2 className="font-google text-lg sm:text-xl font-semibold text-gray-900 mb-3">
          Totals by food class
        </h2>
        {isLoading ? (
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm"
              >
                <Skeleton width={120} height={18} />
                <div className="mt-3 flex items-baseline gap-3">
                  <Skeleton width={40} height={24} />
                  <Skeleton width={60} height={16} />
                </div>
                <Skeleton width={140} height={14} className="mt-3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">Failed to load class-level totals.</p>
        ) : classEntries.length === 0 ? (
          <p className="text-sm text-gray-500">No class-level data available yet.</p>
        ) : (
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {classEntries.map((item) => (
              <div
                key={item.key}
                className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                  {item.label}
                </h3>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Submissions
                    </p>
                    <p className="text-lg sm:text-xl font-semibold text-[#ee7c2b]">
                      {item.submissions}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Images
                    </p>
                    <p className="text-lg sm:text-xl font-semibold text-[#ee7c2b]">
                      {item.images}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
