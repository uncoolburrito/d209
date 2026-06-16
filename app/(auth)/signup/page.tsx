import Link from 'next/link'
import { SignupForm } from './signup-form'

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <p className="text-sm text-neutral-600">
        Only apartment members are allowed. If your email isn&apos;t recognized,
        ask the admin to add it.
      </p>
      <SignupForm />
      <p className="text-sm text-neutral-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
