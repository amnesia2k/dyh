import axios from 'axios'
import { api } from '../api-client'

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

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

    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.message

      throw new Error(message)
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('Failed to upload image')
  }
}
