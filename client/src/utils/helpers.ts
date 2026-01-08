export function formatAction(action: string) {
  return action
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function formatRelativeTime(dateString?: string) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '—'

  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return formatFullDate(date)
}

export function formatFullDate(date: Date | null) {
  if (!date || Number.isNaN(date.getTime())) return 'TBD'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatEventDateTime(date: Date | null) {
  if (!date || Number.isNaN(date.getTime())) return 'Date to be announced'

  const datePart = formatFullDate(date)
  const timePart = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)

  return `${datePart} at ${timePart}`
}

export function getInitials(name?: string) {
  if (!name) return 'NA'
  const [first, second] = name.split(' ').filter(Boolean)
  const firstInitial = first[0] || ''
  const secondInitial = second[0] || ''
  const result = (firstInitial + secondInitial).trim()
  return result ? result.toUpperCase() : firstInitial.toUpperCase() || 'NA'
}

export function formatDateLabel(
  value?: string,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' },
) {
  if (!value) return undefined
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('en-US', options).format(parsed)
}

export function formatTribeName(value?: string) {
  if (!value) return ''
  return formatAction(value)
}
