import SubmissionsTable from '@/src/components/tables/SubmissionsTable'

export const metadata = {
  title: 'Submissions | Admin | Ghana Food Dataset',
}

export default function AdminSubmissionsPage() {
  return (
    <div className="font-raleway">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-google text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
          Submissions
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
          Manage food image submissions here.
        </p>
      </div>
      <div className="rounded-lg    overflow-hidden">
        <SubmissionsTable />
      </div>
    </div>
  )
}
