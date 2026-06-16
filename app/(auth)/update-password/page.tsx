import { UpdateForm } from './update-form'

export default function UpdatePasswordPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Set new password</h1>
      <p className="text-sm text-neutral-600">
        Choose a new password for your account.
      </p>
      <UpdateForm />
    </div>
  )
}
