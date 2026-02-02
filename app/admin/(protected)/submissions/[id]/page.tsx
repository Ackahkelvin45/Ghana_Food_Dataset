'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  useGetSubmissionByIdQuery,
  useDeleteSubmissionMutation,
} from '@/src/features/submissions/submissions.slice'
import DeleteConfirmModal from '@/src/components/modal/DeleteConfirmModal'

function DetailSection({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      <h2 className="mb-4 font-google text-lg font-semibold text-gray-900">
        {title}
      </h2>
      {children}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap gap-2 last:mb-0">
      <span className="text-sm font-medium text-gray-500">{label}:</span>
      <span className="text-sm text-gray-900">{value ?? '—'}</span>
    </div>
  )
}

function ListRow({ label, values }: { label: string; values: string[] }) {
  if (!values?.length) return null
  return (
    <div className="mb-3 flex flex-wrap gap-2 last:mb-0">
      <span className="text-sm font-medium text-gray-500">{label}:</span>
      <span className="text-sm text-gray-900">{values.join(', ')}</span>
    </div>
  )
}

export default function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id: idStr } = use(params)
  const id = parseInt(idStr, 10)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { data, isLoading, isError, error } = useGetSubmissionByIdQuery(
    isNaN(id) ? 0 : id
  )
  const deleteMutation = useDeleteSubmissionMutation()

  const submission =
    data?.success && data?.submission ? data.submission : null

  const handleDeleteConfirm = async () => {
    if (isNaN(id)) return
    try {
      await deleteMutation.mutateAsync(id)
      setDeleteModalOpen(false)
      router.push('/admin/submissions')
    } catch {
      // Error is handled by mutation; modal can stay open
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    } catch {
      return '—'
    }
  }

  if (isNaN(id)) {
    return (
      <div className="font-raleway">
        <p className="text-red-600">Invalid submission ID.</p>
        <Link
          href="/admin/submissions"
          className="mt-4 inline-flex items-center gap-2 text-sm text-[#ee7c2b] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to submissions
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="font-raleway">
        <Skeleton height={32} width={200} className="mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton height={200} />
          <Skeleton height={200} />
        </div>
        <div className="mt-6">
          <Skeleton height={120} count={3} className="mb-4" />
        </div>
      </div>
    )
  }

  if (isError || !submission) {
    return (
      <div className="font-raleway">
        <p className="text-red-600">
          {error instanceof Error ? error.message : 'Submission not found.'}
        </p>
        <Link
          href="/admin/submissions"
          className="mt-4 inline-flex items-center gap-2 text-sm text-[#ee7c2b] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to submissions
        </Link>
      </div>
    )
  }

  const images = submission.images ?? []
  const mainImages = images.filter((img: any) => img.type === 'main')
  const additionalImages = images.filter((img: any) => img.type === 'additional')
  const riceYam = submission.riceYamPlantainMeta
  const koko = submission.kokoMeta
  const bankuFufu = submission.bankuFufuMeta
  const bread = submission.breadMeta
  const gob3 = submission.gob3Meta

  return (
    <div className="font-raleway">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/submissions"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to submissions
        </Link>
        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete submission
        </button>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        title="Delete submission"
        message="Are you sure you want to delete this submission? This action cannot be undone."
      />

      <h1 className="mb-2 font-google text-2xl font-semibold text-gray-900">
        Submission #{submission.id}
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Created {formatDate(submission.createdAt)}
      </p>

      {/* Images */}
      <DetailSection title="Images">
        {images.length === 0 ? (
          <p className="text-sm text-gray-500">No images.</p>
        ) : (
          <div className="space-y-6">
            {mainImages.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600">
                  Main images ({mainImages.length})
                </p>
                <div className="flex flex-wrap gap-4 flex-row">
                  {mainImages.map((img: any) => (
                    <div
                      key={img.id}
                      className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.filename || 'Food image'}
                        className="h-48 w-auto max-w-full object-contain"
                      />
                      <p className="p-2 text-xs text-gray-500">{img.filename}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {additionalImages.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600">
                  Additional images ({additionalImages.length})
                </p>
                <div className="flex flex-wrap gap-4">
                  {additionalImages.map((img: any) => (
                    <div
                      key={img.id}
                      className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.filename || 'Food image'}
                        className="h-48 w-auto max-w-full object-contain"
                      />
                      <p className="p-2 text-xs text-gray-500">{img.filename}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DetailSection>

      {/* Basic info */}
      <DetailSection title="Dish & confirmation" className="mt-6">
        <DetailRow label="Dish" value={submission.dishName} />
        <DetailRow
          label="No person in image"
          value={submission.noPersonInImage ? 'Yes' : 'No'}
        />
        <DetailRow
          label="Accuracy confirmed"
          value={submission.accuracyConfirmed ? 'Yes' : 'No'}
        />
      </DetailSection>

      {/* Location */}
      <DetailSection title="Location" className="mt-6">
        <DetailRow label="Region" value={submission.region} />
        <DetailRow label="Town / community" value={submission.town} />
        <DetailRow label="Food obtained" value={submission.foodObtained} />
        {submission.foodObtainedOther && (
          <DetailRow label="Other (food obtained)" value={submission.foodObtainedOther} />
        )}
      </DetailSection>

      {/* Contributor */}
      <DetailSection title="Contributor (optional)" className="mt-6">
        <DetailRow
          label="Wants acknowledgement"
          value={submission.wantsAcknowledgement ? 'Yes' : 'No'}
        />
        <DetailRow label="Name" value={submission.acknowledgedName} />
        <DetailRow label="Email" value={submission.acknowledgedEmail} />
        <DetailRow label="Phone" value={submission.acknowledgedPhone} />
      </DetailSection>

      {/* Rice / Yam / Plantain */}
      {riceYam && (
        <DetailSection title="Rice / Yam / Plantain" className="mt-6">
          <DetailRow label="Stew" value={riceYam.stew} />
          <DetailRow label="Stew (other)" value={riceYam.stewOther} />
          <ListRow label="Extra items" values={riceYam.extraItems ?? []} />
          <DetailRow label="Extra items (other)" value={riceYam.extraItemsOther} />
          <ListRow label="Protein" values={riceYam.proteinContext ?? []} />
          <DetailRow label="Protein (other)" value={riceYam.proteinContextOther} />
        </DetailSection>
      )}

      {/* Koko */}
      {koko && (
        <DetailSection title="Koko" className="mt-6">
          <ListRow label="Items" values={koko.kokoItems ?? []} />
          <DetailRow label="Other" value={koko.kokoItemsOther} />
        </DetailSection>
      )}

      {/* Banku / Fufu / Kokonte / Kenkey */}
      {bankuFufu && (
        <DetailSection title="Banku / Fufu / Kokonte / Kenkey" className="mt-6">
          <DetailRow label="Soup" value={bankuFufu.soupContext} />
          <DetailRow label="Soup (other)" value={bankuFufu.soupContextOther} />
          <ListRow label="Pepper" values={bankuFufu.pepper ?? []} />
          <DetailRow label="Pepper (other)" value={bankuFufu.pepperOther} />
          <ListRow label="Protein" values={bankuFufu.proteinContext ?? []} />
          <DetailRow label="Protein (other)" value={bankuFufu.proteinContextOther} />
        </DetailSection>
      )}

      {/* Bread */}
      {bread && (
        <DetailSection title="Bread" className="mt-6">
          <DetailRow label="Bread type" value={bread.breadType} />
          <DetailRow label="Bread type (other)" value={bread.breadTypeOther} />
          <ListRow label="Served with" values={bread.breadServedWith ?? []} />
          <DetailRow label="Served with (other)" value={bread.breadServedWithOther} />
        </DetailSection>
      )}

      {/* Gob3 */}
      {gob3 && (
        <DetailSection title="Gob3 (Beans)" className="mt-6">
          <ListRow label="Served with" values={gob3.gob3ServedWith ?? []} />
          <DetailRow label="Served with (other)" value={gob3.gob3ServedWithOther} />
          <ListRow label="Protein" values={gob3.proteinContext ?? []} />
          <DetailRow label="Protein (other)" value={gob3.proteinContextOther} />
        </DetailSection>
      )}
    </div>
  )
}
