'use client'

import { useEffect } from 'react'
import { Trash2 } from 'lucide-react'

type DeleteConfirmModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
  title?: string
  message?: string
}

export default function DeleteConfirmModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading = false,
  title = 'Delete submission',
  message = 'Are you sure you want to delete this submission? This action cannot be undone.',
}: DeleteConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  // Close on Escape (same as LogoutModal)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onOpenChange])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Backdrop - same as LogoutModal */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={() => onOpenChange(false)}
        disabled={isLoading}
      />

      {/* Modal panel - same structure and classes as LogoutModal */}
      <div className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <Trash2 className="h-5 w-5 shrink-0 text-red-500" />
          <h2 id="delete-modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
        </div>

        <p className="py-4 text-gray-600">
          {message}
        </p>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
