'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isValidatingToken, setIsValidatingToken] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)

  useEffect(() => {
    // Validate token on page load
    const validateToken = async () => {
      if (!token) {
        setError('Invalid reset link. Please request a new password reset.')
        setIsValidatingToken(false)
        return
      }

      try {
        const response = await fetch('/api/auth/validate-reset-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        if (response.ok) {
          setIsTokenValid(true)
        } else {
          const data = await response.json()
          setError(data.error || 'Invalid or expired reset link.')
        }
      } catch (err) {
        setError('Failed to validate reset link. Please try again.')
      } finally {
        setIsValidatingToken(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setIsSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login?message=password-reset-success')
      }, 3000)

    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isValidatingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ee7c2b] border-t-transparent mx-auto mb-4" />
            <p className="text-gray-600">Validating reset link...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isTokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto h-16 w-16 text-red-600 mb-4" />
            <h1 className="font-google text-2xl font-semibold text-red-900 mb-4">
              Invalid Reset Link
            </h1>
            <p className="text-red-700 mb-6">
              {error || 'This password reset link is invalid or has expired.'}
            </p>
            <Link
              href="/forgot-password"
              className="block w-full rounded-lg bg-[#ee7c2b] py-2.5 font-medium text-white hover:bg-[#d66a1f] transition-colors text-center"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h1 className="font-google text-2xl font-semibold text-green-900 mb-4">
              Password Reset Successful!
            </h1>
            <p className="text-green-700 mb-6">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <p className="text-sm text-green-600 mb-6">
              Redirecting to login page...
            </p>
            <Link
              href="/login"
              className="block w-full rounded-lg bg-[#ee7c2b] py-2.5 font-medium text-white hover:bg-[#d66a1f] transition-colors text-center"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="font-google text-2xl font-semibold text-gray-900">
              Reset Your Password
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 font-raleway">
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-12 text-gray-900 placeholder-gray-400 focus:border-[#ee7c2b] focus:outline-none focus:ring-1 focus:ring-[#ee7c2b]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-12 text-gray-900 placeholder-gray-400 focus:border-[#ee7c2b] focus:outline-none focus:ring-1 focus:ring-[#ee7c2b]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ee7c2b] py-2.5 font-medium text-white hover:bg-[#d66a1f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{' '}
            <Link href="/login" className="text-[#ee7c2b] hover:text-[#d66a1f] font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}