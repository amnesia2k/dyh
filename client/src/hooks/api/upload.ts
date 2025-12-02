import { api } from '../api-client'
import { formatApiError, unwrapData } from './common'
import type { ApiResponse } from './common'

export type UploadImageResult = {
  imageUrl: string
  publicId?: string
  width?: number
  height?: number
  format?: string
}

export async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await api.post<ApiResponse<UploadImageResult>>(
      '/upload/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}
