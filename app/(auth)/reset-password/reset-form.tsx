'use client'

import { useActionState } from 'react'
import { requestPasswordResetAction } from '../actions'
import { SubmitButton } from '../submit-button'

export function ResetForm() {
  const [state, formAction] = useActionState(
    requestPasswordResetAction,
    undefined,
  )

  if (state?.ok) {
    return (
      <p className="rounded-md bg-green-50 border border-green-200 text-green-800 text-sm p-3">
        Check your email for a reset link.
      </p>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        />
      </div>
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <SubmitButton label="Send reset link" />
    </form>
  )
}
