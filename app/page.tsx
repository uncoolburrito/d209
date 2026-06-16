import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-6 gap-4 text-center">
      <h1 className="text-3xl font-semibold">Welcome to Wasim</h1>
      <p className="text-neutral-600">
        Signed in as{' '}
        <strong>{profile?.display_name ?? user.email}</strong>
      </p>
      <p className="text-sm text-neutral-500 max-w-md">
        Auth works! Realtime messaging is the next chunk.
      </p>
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="mt-4 rounded-md bg-neutral-900 text-white px-4 py-2 text-sm hover:bg-neutral-800"
        >
          Sign out
        </button>
      </form>
    </main>
  )
}
