import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { triggerAssessment } from '../../network/mutations/triggerAssessment'

export const useTriggerAssessment = (setError: (error: string | null) => void) => {
  const { phaseId } = useParams<{ phaseId: string }>()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => triggerAssessment(phaseId ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['gitHubDeveloperProfile', phaseId],
      })
      queryClient.invalidateQueries({
        queryKey: ['gitHubPassedStudentsCount', phaseId],
      })
      setError(null)
    },
    onError: (error) => {
      queryClient.invalidateQueries({
        queryKey: ['gitHubDeveloperProfile', phaseId],
      })
      queryClient.invalidateQueries({
        queryKey: ['gitHubPassedStudentsCount', phaseId],
      })
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
