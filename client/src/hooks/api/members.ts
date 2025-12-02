import { api } from '../api-client'
import { formatApiError, unwrapData } from './common'
import type { ApiListResponse, ApiResponse } from './common'
import type { CreateMemberPayload, Member, UpdateMemberPayload } from './types'

export async function fetchMembers() {
  try {
    const response = await api.get<ApiListResponse<Array<Member>>>('/member')
    const members = response.data.data ?? []
    const count =
      typeof response.data.count === 'number'
        ? response.data.count
        : members.length

    return { members, count }
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function fetchMemberById(id: string) {
  try {
    const response = await api.get<ApiResponse<Member>>(`/member/${id}`)

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function createMember(payload: CreateMemberPayload) {
  try {
    const response = await api.post<ApiResponse<Member>>('/member', payload)

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function updateMember(id: string, payload: UpdateMemberPayload) {
  try {
    const response = await api.patch<ApiResponse<Member>>(
      `/member/${id}`,
      payload,
    )

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function deleteMember(id: string) {
  try {
    const response = await api.delete<ApiResponse>(`/member/${id}`)

    return response.data.message
  } catch (error) {
    throw formatApiError(error)
  }
}
