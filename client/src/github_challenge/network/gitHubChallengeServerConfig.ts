import { env, parseURL } from '@tumaet/prompt-shared-state'
import axios from 'axios'

const GITHUB_CHALLENGE_SERVER = env.DEVOPS_CHALLENGE_HOST || ''

const SERVER_BASE_URL = parseURL(GITHUB_CHALLENGE_SERVER)

export interface Patch {
  op: 'replace' | 'add' | 'remove' | 'copy'
  path: string
  value: string
}

const AUTHENTICATED_AXIOS_INSTANCE = axios.create({
  baseURL: SERVER_BASE_URL,
})

AUTHENTICATED_AXIOS_INSTANCE.interceptors.request.use((config) => {
  if (localStorage.getItem('jwt_token') && localStorage.getItem('jwt_token') !== '') {
    config.headers.Authorization = `Bearer ${localStorage.getItem('jwt_token') ?? ''}`
  }
  return config
})

export { AUTHENTICATED_AXIOS_INSTANCE as gitHubChallengeAxiosInstance }
