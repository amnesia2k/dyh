import { useMutation } from '@tanstack/react-query'

import { post } from '../api'
import type { ApiError } from '../api'

export interface UploadImageResult {
  imageUrl: string
  publicId: string
  width: number
  height: number
  format: string
}

export function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('image', file)

  return post<UploadImageResult, FormData>('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function useUploadImageMutation() {
  return useMutation<UploadImageResult, ApiError, File>({
    mutationFn: uploadImage,
  })
}
