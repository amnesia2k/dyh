import { useCallback, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const STORAGE_KEY = 'demo_server_funcs_todos'
const DEFAULT_TODOS = [
  { id: 1, name: 'Get groceries' },
  { id: 2, name: 'Plan youth meetup' },
]
const isBrowser = typeof window !== 'undefined'

const loadTodos = () => {
  if (isBrowser) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        return JSON.parse(raw)
      }
    } catch {
      // Ignore storage issues and fall back to defaults
    }
  }

  return DEFAULT_TODOS
}

const persistTodos = (todos: Array<{ id: number; name: string }>) => {
  if (isBrowser) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch {
      // Ignore storage issues
    }
  }

  return todos
}

export const Route = createFileRoute('/demo/start/server-funcs')({
  component: Home,
  loader: () => loadTodos(),
})

function Home() {
  const initialTodos = Route.useLoaderData()
  const [todos, setTodos] = useState(initialTodos)
  const [todo, setTodo] = useState('')

  const submitTodo = useCallback(() => {
    const trimmed = todo.trim()
    if (!trimmed) return

    const nextId = todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1
    const next = [...todos, { id: nextId, name: trimmed }]
    setTodos(next)
    persistTodos(next)
    setTodo('')
  }, [todo, todos])

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-linear-to-br from-zinc-800 to-black p-4 text-white"
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 20% 60%, #23272a 0%, #18181b 50%, #000000 100%)',
      }}
    >
      <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
        <h1 className="text-2xl mb-4">
          Start Server Functions (now client-side)
        </h1>
        <p className="text-white/70 mb-4">
          Server handlers have been removed. Todos are stored locally so you can
          keep iterating without a backend.
        </p>
        <ul className="mb-4 space-y-2">
          {todos?.map((t) => (
            <li
              key={t.id}
              className="bg-white/10 border border-white/20 rounded-lg p-3 backdrop-blur-sm shadow-md"
            >
              <span className="text-lg text-white">{t.name}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submitTodo()
              }
            }}
            placeholder="Enter a new todo..."
            className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <button
            disabled={todo.trim().length === 0}
            onClick={submitTodo}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Add todo
          </button>
        </div>
      </div>
    </div>
  )
}
