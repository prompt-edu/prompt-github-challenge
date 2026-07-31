import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import type { DeveloperProfile } from '../../interfaces/DeveloperProfile'
import { getDeveloperProfile } from '../../network/queries/getDeveloperProfile'

export const useGetDeveloperProfile = () => {
  const { phaseId } = useParams<{ phaseId: string }>()

  return useQuery<DeveloperProfile | undefined>({
    queryKey: ['gitHubDeveloperProfile', phaseId],
    queryFn: () => getDeveloperProfile(phaseId ?? ''),
  })
}
