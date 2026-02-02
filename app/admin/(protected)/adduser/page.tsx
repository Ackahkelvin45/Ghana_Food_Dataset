'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { UserPlus, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react'
import { useCreateUserMutation } from '@/src/features/users/users.slice'

type AddUserForm = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  userType: 'USER' | 'ADMIN'
  phone: string
}

export default function AdminAddUserPage() {
  const router = useRouter()
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUserMutation()
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddUserForm>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'USER',
      phone: '',
    },
  })

  const password = watch('password')

  const onSubmit = async (data: AddUserForm) => {
    setApiError(null)
    setSuccessMessage(null)
    try {
      await createUser({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        password: data.password,
        userType: data.userType,
        phone: data.phone?.trim() || undefined,
      })
      setSuccessMessage('User created successfully. Redirecting to users list…')
      setTimeout(() => {
        router.push('/admin/users')
        router.refresh()
      }, 2000)
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  const inputClass =
    'w-full text-sm rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#ee7c2b] focus:outline-none focus:ring-1 focus:ring-[#ee7c2b]'
  const inputErrorClass = 'border-red-500 focus:border-red-500 focus:ring-red-500'

  return (
    <div className="w-full h-full flex px-4 py-12">
      <div className="w-full">
        <Link
          href="/admin/users"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Link>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex border-b border-gray-200 pb-4 items-center gap-3">
            <div>
              <h1 className="font-google text-2xl font-semibold text-gray-900">
                Add new user
              </h1>
              <p className="text-sm text-gray-500">
                Create a new user account for the admin portal
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-raleway">
            {successMessage && (
              <div
                className="flex sm:items-center p-4 mb-4 text-sm text-green-800 bg-green-50 border-t-4 border-green-500"
                role="alert"
              >
                <svg
                  className="w-4 h-4 shrink-0 mt-0.5 md:mt-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <span className="sr-only">Info</span>
                <div className="ms-2 text-sm">{successMessage}</div>
                <button
                  type="button"
                  className="ms-auto -mx-1.5 -my-1.5 rounded focus:ring-2 focus:ring-green-300 p-1.5 hover:bg-green-100 inline-flex items-center justify-center h-8 w-8 shrink-0"
                  aria-label="Close"
                  onClick={() => setSuccessMessage(null)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18 17.94 6M18 18 6.06 6"
                    />
                  </svg>
                </button>
              </div>
            )}

            {apiError && (
              <div
                className="flex sm:items-center p-4 mb-4 text-sm text-red-800 bg-red-50 border-t-4 border-red-500"
                role="alert"
              >
                <svg
                  className="w-4 h-4 shrink-0 mt-0.5 md:mt-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <span className="sr-only">Info</span>
                <div className="ms-2 text-sm">{apiError}</div>
                <button
                  type="button"
                  className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-800 rounded focus:ring-2 focus:ring-red-300 p-1.5 hover:bg-red-100 inline-flex items-center justify-center h-8 w-8 shrink-0"
                  aria-label="Close"
                  onClick={() => setApiError(null)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18 17.94 6M18 18 6.06 6"
                    />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex flex-row gap-2">
              <div className="w-full">
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Full name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter full name"
                    className={`${inputClass} ${errors.fullName ? inputErrorClass : ''}`}
                    {...register('fullName', {
                      required: 'Full name is required',
                      minLength: { value: 2, message: 'At least 2 characters' },
                    })}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className={`${inputClass} ${errors.email ? inputErrorClass : ''}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <div className="w-full">
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`${inputClass} ${errors.password ? inputErrorClass : ''}`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'At least 6 characters' },
                    })}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Confirm password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`${inputClass} ${errors.confirmPassword ? inputErrorClass : ''}`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      minLength: { value: 6, message: 'At least 6 characters' },
                      validate: (value: string) =>
                        value === password || 'Passwords do not match',
                    })}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <div className="w-full">
                <label
                  htmlFor="userType"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="userType"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-4 pr-4 text-gray-900 focus:border-[#ee7c2b] focus:outline-none focus:ring-1 focus:ring-[#ee7c2b]"
                  {...register('userType', { required: true })}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="w-full">
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Phone <span className="text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+233 ..."
                    className={inputClass}
                    {...register('phone')}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end w-full mt-20">
              <button
                type="submit"
                disabled={isSubmitting || isCreating}
                className="flex w-fit px-10 font-google font-semibold items-center justify-center gap-2 rounded-lg bg-[#ee7c2b] py-2.5 text-white hover:bg-[#d66a1f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {(isSubmitting || isCreating) ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>Create user</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
