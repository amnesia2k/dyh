import { useMutation } from '@tanstack/react-query'

import { ApiError } from '../api'

export interface UploadImageResult {
  imageUrl: string
  publicId: string
  width: number
  height: number
  format: string
}

const simulateLatency = async <T>(result: T, delay = 300) =>
  await new Promise<T>((resolve) => setTimeout(() => resolve(result), delay))

export function uploadImage(file: File | null | undefined) {
  if (!file) {
    throw new ApiError('No image provided for upload')
  }

  const imageUrl =
    typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
      ? URL.createObjectURL(file)
      : 'https://placehold.co/400x400?text=Upload'

  const mimeType = file.type || 'image/jpeg'

  return simulateLatency<UploadImageResult>({
    imageUrl,
    publicId: `local-${Date.now()}`,
    width: 600,
    height: 600,
    format: mimeType.split('/')[1] ?? mimeType,
  })
}

export function useUploadImageMutation() {
  return useMutation<UploadImageResult, ApiError, File | null | undefined>({
    mutationFn: uploadImage,
  })
}
