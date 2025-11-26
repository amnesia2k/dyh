import { useCallback, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/demo/tanstack-query')({
  component: TanStackQueryDemo,
})

type Todo = {
  id: number
  name: string
}

const STORAGE_KEY = 'demo_query_todos'
const DEFAULT_TODOS: Array<Todo> = [
  { id: 1, name: 'Draft welcome email' },
  { id: 2, name: 'Confirm tribe head rota' },
  { id: 3, name: 'Review prayer requests' },
]
const isBrowser = typeof window !== 'undefined'

const loadTodos = (): Array<Todo> => {
  if (isBrowser) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        return JSON.parse(raw)
      }
    } catch {
      // Ignore storage errors and fall back to defaults
    }
  }

  return DEFAULT_TODOS
}

const persistTodos = (todos: Array<Todo>) => {
  if (isBrowser) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch {
      // Ignore storage errors
    }
  }

  return todos
}

function TanStackQueryDemo() {
  const queryClient = useQueryClient()
  const { data = [] } = useQuery<Array<Todo>>({
    queryKey: ['todos'],
    queryFn: () => Promise.resolve(loadTodos()),
    initialData: loadTodos(),
  })

  const { mutateAsync: addTodo } = useMutation({
    mutationFn: (todo: string) => {
      const todos = loadTodos()
      const nextId = todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1
      const next = [...todos, { id: nextId, name: todo }]
      return Promise.resolve(persistTodos(next))
    },
    onSuccess: (next) => {
      queryClient.setQueryData<Array<Todo>>(['todos'], next)
    },
  })

  const [todo, setTodo] = useState('')

  const submitTodo = useCallback(async () => {
    const trimmed = todo.trim()
    if (!trimmed) return

    await addTodo(trimmed)
    setTodo('')
  }, [addTodo, todo])

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-linear-to-br from-red-900 via-red-800 to-black p-4 text-white"
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 80% 20%, #3B021F 0%, #7B1028 60%, #1A000A 100%)',
      }}
    >
      <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
        <h1 className="text-2xl mb-4">TanStack Query Todos list</h1>
        <ul className="mb-4 space-y-2">
          {data.map((t) => (
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
