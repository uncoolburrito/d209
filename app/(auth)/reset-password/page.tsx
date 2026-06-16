import Link from 'next/link'
import { ResetForm } from './reset-form'

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reset password</h1>
      <p className="text-sm text-neutral-600">
        Enter your email and we&apos;ll send you a link to set a new password.
      </p>
      <ResetForm />
      <p className="text-sm">
        <Link href="/login" className="text-blue-600 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
