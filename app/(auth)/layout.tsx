export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6 bg-neutral-50">
      <div className="w-full max-w-sm bg-white rounded-lg border border-neutral-200 p-6 shadow-sm">
        {children}
      </div>
    </div>
  )
}
