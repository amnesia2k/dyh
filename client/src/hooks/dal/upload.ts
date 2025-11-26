import { useMutation, type UseMutationOptions } from '@tanstack/react-query'

import { uploadImage, type UploadImageResult } from '../api/upload'

export function useUploadImageMutation(
  options?: UseMutationOptions<UploadImageResult, Error, File>,
) {
  return useMutation<UploadImageResult, Error, File>({
    mutationKey: ['upload', 'image'],
    mutationFn: uploadImage,
    ...options,
  })
}

export type { UploadImageResult } from '../api/upload'
