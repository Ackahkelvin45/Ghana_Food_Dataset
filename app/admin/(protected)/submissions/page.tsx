import SubmissionsTable from '@/src/components/tables/SubmissionsTable'

export const metadata = {
  title: 'Submissions | Admin | Ghana Food Dataset',
}

export default function AdminSubmissionsPage() {
  return (
    <div className="font-raleway">
      <h1 className="mb-4 font-google text-2xl font-semibold text-gray-900">
        Submissions
      </h1>
      <p className="mb-6 text-gray-600">Manage food image submissions here.</p>
      <SubmissionsTable />
    </div>
  )
}
