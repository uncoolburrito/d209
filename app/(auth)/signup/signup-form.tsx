'use client'

import { useActionState } from 'react'
import { signUpAction } from '../actions'
import { SubmitButton } from '../submit-button'

export function SignupForm() {
  const [state, formAction] = useActionState(signUpAction, undefined)
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
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password (min 8 chars)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        />
      </div>
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <SubmitButton label="Sign up" />
    </form>
  )
}
