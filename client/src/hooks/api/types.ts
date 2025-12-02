export type FeedbackStatus = 'new' | 'read' | 'resolved'

export type Member = {
  _id: string
  fullName: string
  email?: string
  phone?: string
  birthday?: string
  address?: string
  departmentOfInterest?: string
  joinedAt?: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateMemberPayload = {
  fullName: string
  email?: string
  phone?: string
  birthday?: string
  address?: string
  departmentOfInterest?: string
  joinedAt?: string
  imageUrl?: string
}

export type UpdateMemberPayload = Partial<CreateMemberPayload>

export type Event = {
  _id: string
  title: string
  date: string
  location?: string
  description?: string
  imageUrl?: string
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

export type CreateEventPayload = {
  title: string
  date: string
  location?: string
  description?: string
  imageUrl?: string
  featured?: boolean
}

export type UpdateEventPayload = Partial<CreateEventPayload>

export type Announcement = {
  _id: string
  title: string
  date: string
  summary?: string
  body?: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateAnnouncementPayload = {
  title: string
  date: string
  summary?: string
  body?: string
  imageUrl?: string
}

export type UpdateAnnouncementPayload = Partial<CreateAnnouncementPayload>

export type Sermon = {
  _id: string
  title: string
  date: string
  spotifyEmbedUrl?: string
  description?: string
  speaker?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateSermonPayload = {
  title: string
  date: string
  spotifyEmbedUrl?: string
  description?: string
  speaker?: string
}

export type UpdateSermonPayload = Partial<CreateSermonPayload>

export type Testimony = {
  _id: string
  fullName?: string
  email?: string
  message: string
  anonymous?: boolean
  status?: FeedbackStatus
  featured?: boolean
  approved?: boolean
  approvedAt?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateTestimonyPayload = {
  fullName: string
  email: string
  message: string
  anonymous?: boolean
  status?: FeedbackStatus
}

export type UpdateTestimonyPayload = {
  status?: FeedbackStatus
  featured?: boolean
  approved?: boolean
  approvedAt?: string
}

export type PrayerRequest = {
  _id: string
  fullName?: string
  email?: string
  message: string
  anonymous?: boolean
  status?: FeedbackStatus
  resolvedAt?: string
  createdAt?: string
  updatedAt?: string
}

export type CreatePrayerRequestPayload = {
  fullName?: string
  email?: string
  message: string
  anonymous?: boolean
  status?: FeedbackStatus
}

export type UpdatePrayerRequestPayload = {
  fullName?: string
  email?: string
  message?: string
  anonymous?: boolean
  status?: FeedbackStatus
}

export type ActivityLog = {
  _id: string
  action: string
  type: 'NEW' | 'UPDATED' | 'DELETED'
  message?: string
  meta?: { [key: string]: any }
  createdAt?: string
  updatedAt?: string
}

export type HealthCheck = {
  status: string
  timestamp: string
}
