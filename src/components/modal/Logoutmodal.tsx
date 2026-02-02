'use client'

import { useEffect } from 'react'
import { LogOut } from 'lucide-react'

type LogoutModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
}

export default function LogoutModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: LogoutModalProps) {
  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  // Close on Escape
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
      aria-labelledby="logout-modal-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={() => onOpenChange(false)}
        disabled={isLoading}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <LogOut className="h-5 w-5 shrink-0 text-red-500" />
          <h2 id="logout-modal-title" className="text-lg font-semibold text-gray-900">
            Sign out
          </h2>
        </div>

        <p className="py-4 text-gray-600">
          Are you sure you want to sign out of your account?
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
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Sign out
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
