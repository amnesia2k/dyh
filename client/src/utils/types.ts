import type { LucideIcon } from 'lucide-react'

export type StatCardProps = {
  icon: LucideIcon
  label: string
  value: number
  subtext?: string
  badgeClass: string
}
