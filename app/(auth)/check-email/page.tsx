import Link from 'next/link'

export default function CheckEmailPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Check your email</h1>
      <p className="text-sm text-neutral-600">
        We sent you a verification link. Click it to finish signing up, then
        come back to sign in.
      </p>
      <p className="text-sm">
        <Link href="/login" className="text-blue-600 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
