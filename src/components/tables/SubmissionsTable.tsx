'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Trash2, Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useGetSubmissionsQuery,
  useDeleteSubmissionMutation,
} from '@/src/features/submissions/submissions.slice'
import type { GetSubmissionsParams } from '@/app/api/submissions/submissions.api'
import DeleteConfirmModal from '@/src/components/modal/DeleteConfirmModal'

export type SubmissionRow = {
  id: number
  dishName: string
  region: string
  town: string | null
  foodObtained: string
  imageCount: number
  createdAt: string
}

const DISH_OPTIONS = [
  { value: '', label: 'All dishes' },
  { value: 'Yam', label: 'Yam' },
  { value: 'Plantain (boiled)', label: 'Plantain (boiled)' },
  { value: 'Kenkey', label: 'Kenkey' },
  { value: 'Banku', label: 'Banku' },
  { value: 'Kokonte', label: 'Kokonte' },
  { value: 'Fufu', label: 'Fufu' },
  { value: 'Jollof', label: 'Jollof' },
  { value: 'Plain Rice', label: 'Plain Rice' },
  { value: 'Waakye', label: 'Waakye' },
  { value: 'Bread', label: 'Bread' },
  { value: 'Koko', label: 'Koko' },
  { value: 'Beans (Gob3)', label: 'Beans (Gob3)' },
]

const REGION_OPTIONS = [
  { value: '', label: 'All regions' },
  { value: 'AHAFO', label: 'AHAFO' },
  { value: 'ASHANTI', label: 'ASHANTI' },
  { value: 'BONO EAST', label: 'BONO EAST' },
  { value: 'BRONG AHAFO', label: 'BRONG AHAFO' },
  { value: 'CENTRAL', label: 'CENTRAL' },
  { value: 'EASTERN', label: 'EASTERN' },
  { value: 'GREATER ACCRA', label: 'GREATER ACCRA' },
  { value: 'NORTH EAST', label: 'NORTH EAST' },
  { value: 'NORTHERN', label: 'NORTHERN' },
  { value: 'OTI', label: 'OTI' },
  { value: 'SAVANNAH', label: 'SAVANNAH' },
  { value: 'UPPER EAST', label: 'UPPER EAST' },
  { value: 'UPPER WEST', label: 'UPPER WEST' },
  { value: 'VOLTA', label: 'VOLTA' },
  { value: 'WESTERN', label: 'WESTERN' },
  { value: 'WESTERN NORTH', label: 'WESTERN NORTH' },
]

function SubmissionsTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const dishName = searchParams.get('dishName') ?? ''
  const region = searchParams.get('region') ?? ''
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const limit = Math.min(100, Math.max(10, parseInt(searchParams.get('limit') ?? '20', 10) || 20))
  const offset = (page - 1) * limit

  const params: GetSubmissionsParams = {
    ...(search && { search }),
    ...(dishName && { dishName }),
    ...(region && { region }),
    limit,
    offset,
  }

  const { data, isLoading, isError, error } = useGetSubmissionsQuery(params)
  const deleteMutation = useDeleteSubmissionMutation()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [searchInput, setSearchInput] = useState(search)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  const updateQuery = useCallback(
    (updates: {
      search?: string
      dishName?: string
      region?: string
      page?: number
      limit?: number
    }) => {
      const next = new URLSearchParams(searchParams.toString())
      if (updates.search !== undefined) {
        if (updates.search) next.set('search', updates.search)
        else next.delete('search')
      }
      if (updates.dishName !== undefined) {
        if (updates.dishName) next.set('dishName', updates.dishName)
        else next.delete('dishName')
      }
      if (updates.region !== undefined) {
        if (updates.region) next.set('region', updates.region)
        else next.delete('region')
      }
      if (updates.page !== undefined) {
        if (updates.page <= 1) next.delete('page')
        else next.set('page', String(updates.page))
      }
      if (updates.limit !== undefined) {
        if (updates.limit === 20) next.delete('limit')
        else next.set('limit', String(updates.limit))
      }
      const qs = next.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  const list = data?.success && Array.isArray(data?.data) ? data.data : []
  const rows: SubmissionRow[] = list.map((s: any) => ({
    id: s.id,
    dishName: s.dishName ?? '—',
    region: s.region ?? '—',
    town: s.town ?? null,
    foodObtained: s.foodObtained ?? '—',
    imageCount: Array.isArray(s.images) ? s.images.length : 0,
    createdAt: s.createdAt ?? '',
  }))

  const openDeleteModal = (id: number) => {
    setDeleteTargetId(id)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (deleteTargetId == null) return
    setDeletingId(deleteTargetId)
    try {
      await deleteMutation.mutateAsync(deleteTargetId)
      setDeleteModalOpen(false)
      setDeleteTargetId(null)
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
                <th className="px-6 py-3 font-medium text-gray-600">ID</th>
                <th className="px-6 py-3 font-medium text-gray-600">Dish</th>
                <th className="px-6 py-3 font-medium text-gray-600">Region</th>
                <th className="px-6 py-3 font-medium text-gray-600">Town</th>
                <th className="px-6 py-3 font-medium text-gray-600">Food obtained</th>
                <th className="px-6 py-3 font-medium text-gray-600">Images</th>
                <th className="px-6 py-3 font-medium text-gray-600">Created</th>
                <th className="px-6 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-6 py-4">
                    <Skeleton width={32} height={20} />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton width={100} height={20} />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton width={90} height={20} />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton width={80} height={20} />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton width={100} height={20} />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton width={24} height={20} />
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
        {error instanceof Error ? error.message : 'Failed to load submissions.'}
      </div>
    )
  }

  const hasFilters = search || dishName || region
  const clearFilters = () => updateQuery({ search: '', dishName: '', region: '', page: 1 })
  const pagination = data?.pagination
  const total = pagination?.total ?? 0
  const hasMore = pagination?.hasMore ?? false
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 1

  if (rows.length === 0 && !isLoading) {
    return (
      <div className="space-y-4">
        {renderFilters()}
        <div className="rounded-lg border border-gray-200 bg-white py-12 text-center shadow-sm">
          <p className="text-gray-500">
            {hasFilters ? 'No submissions match your filters.' : 'No submissions yet.'}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-2 text-sm text-[#ee7c2b] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    )
  }

  function renderFilters() {
    return (
      <div className="space-y-4 lg:space-y-0 lg:flex lg:justify-end lg:items-center lg:gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updateQuery({ search: searchInput.trim(), page: 1 })}
            onBlur={() => updateQuery({ search: searchInput.trim(), page: 1 })}
            placeholder="Search by town, region, food obtained..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-[#ee7c2b] focus:outline-none focus:ring-1 focus:ring-[#ee7c2b]"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <select
            value={dishName}
            onChange={(e) => updateQuery({ dishName: e.target.value, page: 1 })}
            className="rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-[#ee7c2b] focus:outline-none focus:ring-1 focus:ring-[#ee7c2b] min-w-[140px]"
          >
            {DISH_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={region}
            onChange={(e) => updateQuery({ region: e.target.value, page: 1 })}
            className="rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-[#ee7c2b] focus:outline-none focus:ring-1 focus:ring-[#ee7c2b] min-w-[140px]"
          >
            {REGION_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={limit}
            onChange={(e) => updateQuery({ limit: Number(e.target.value), page: 1 })}
            className="rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-[#ee7c2b] focus:outline-none focus:ring-1 focus:ring-[#ee7c2b] min-w-[120px]"
            aria-label="Rows per page"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onOpenChange={(open) => {
          setDeleteModalOpen(open)
          if (!open) setDeleteTargetId(null)
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        title="Delete submission"
        message="Are you sure you want to delete this submission? This action cannot be undone."
      />
      {renderFilters()}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">
                ID
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Dish
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Region
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Town
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Food obtained
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Images
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
            {rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <Link
                      href={`/admin/submissions/${row.id}`}
                      className="text-[#ee7c2b] hover:underline"
                    >
                      {row.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{row.dishName}</td>
                  <td className="px-6 py-4">{row.region}</td>
                  <td className="px-6 py-4">{row.town ?? '—'}</td>
                  <td className="px-6 py-4">{row.foodObtained}</td>
                  <td className="px-6 py-4">{row.imageCount}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => openDeleteModal(row.id)}
                      disabled={deletingId === row.id}
                      className="inline-flex items-center gap-1 text-gray-600 hover:text-red-600 disabled:opacity-50"
                      aria-label="Delete submission"
                    >
                      {deletingId === row.id ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
        {(total > 0 || page > 1) && (
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 border-t border-gray-200 px-4 sm:px-6 py-3 text-sm text-gray-600">
            <span className="text-center sm:text-left">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => updateQuery({ page: page - 1 })}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Previous</span>
              </button>
              <span className="px-2 text-center min-w-[100px]">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => updateQuery({ page: page + 1 })}
                disabled={!hasMore}
                className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
              >
                <span className="hidden xs:inline">Next</span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubmissionsTable
