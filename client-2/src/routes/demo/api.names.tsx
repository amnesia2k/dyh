import { createFileRoute } from '@tanstack/react-router'

const SAMPLE_NAMES = ['Alice', 'Bob', 'Charlie', 'Dana', 'Emeka', 'Fola']

export const Route = createFileRoute('/demo/api/names')({
  component: NamesFallback,
})

function NamesFallback() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-semibold">API endpoints disabled</h1>
        <p className="text-white/70">
          Backend calls are stubbed out for now. Here are some sample names you
          can use while developing UI flows.
        </p>
        <ul className="grid grid-cols-2 gap-3">
          {SAMPLE_NAMES.map((name) => (
            <li key={name} className="rounded-lg bg-white/10 px-4 py-2">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
