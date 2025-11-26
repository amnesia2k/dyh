import { createFileRoute } from '@tanstack/react-router'

const SAMPLE_TODOS = [
  { id: 1, name: 'Draft welcome email' },
  { id: 2, name: 'Schedule tribe meetup' },
  { id: 3, name: 'Prepare testimony notes' },
]

export const Route = createFileRoute('/demo/api/tq-todos')({
  component: TodosApiPlaceholder,
})

function TodosApiPlaceholder() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-4">
        <h1 className="text-2xl font-semibold text-center">
          Todo API disabled
        </h1>
        <p className="text-white/70 text-center">
          Server handlers have been removed. Use these sample todos while you
          wire up a new backend.
        </p>
        <div className="grid gap-3">
          {SAMPLE_TODOS.map((todo) => (
            <div
              key={todo.id}
              className="rounded-lg bg-white/10 border border-white/10 px-4 py-3"
            >
              {todo.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
