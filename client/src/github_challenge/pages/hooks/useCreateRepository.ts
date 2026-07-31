import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { createRepository } from '../../network/mutations/createRepository'

export const useCreateRepository = (setError: (error: string | null) => void) => {
  const { phaseId } = useParams<{ phaseId: string }>()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (githubUsername?: string) => createRepository(githubUsername ?? '', phaseId ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['gitHubDeveloperProfile', phaseId],
      })
      setError(null)
    },
    onError: (error) => {
      const serverError = isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error
        : undefined
      if (serverError) {
        setError(serverError)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    },
  })
}
