import { isAxiosError } from 'axios'
import type { DeveloperProfile } from '../../interfaces/DeveloperProfile'
import { gitHubChallengeAxiosInstance } from '../gitHubChallengeServerConfig'

export const getDeveloperProfile = async (
  coursePhaseID: string,
): Promise<DeveloperProfile | undefined> => {
  try {
    return (await gitHubChallengeAxiosInstance.get(`/${coursePhaseID}/info`)).data
  } catch (err: unknown) {
    console.error(err)
    if (
      isAxiosError<{ error?: string }>(err) &&
      err.response?.status === 404 &&
      err.response.data?.error === 'student not found'
    ) {
      return undefined
    } else {
      throw err
    }
  }
}
