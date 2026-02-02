import Link from 'next/link'

export const metadata = {
  title: 'Docs | Admin | Ghana Food Dataset',
}

export default function AdminDocsPage() {
  return (
    <div className="font-raleway">
      <h1 className="mb-4 font-google text-2xl font-semibold text-gray-900">
        API Documentation
      </h1>
      <p className="mb-4 text-gray-600">
        View the API documentation and try endpoints.
      </p>
      <Link
        href="/swagger"
        className="inline-flex items-center rounded-md bg-[#ee7c2b] px-4 py-2 font-medium text-white hover:bg-[#d66a1f]"
      >
        Open Swagger UI
      </Link>
    </div>
  )
}
