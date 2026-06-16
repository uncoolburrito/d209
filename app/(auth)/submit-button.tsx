'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-neutral-900 text-white py-2 font-medium disabled:opacity-50 hover:bg-neutral-800 transition-colors"
    >
      {pending ? '...' : label}
    </button>
  )
}
