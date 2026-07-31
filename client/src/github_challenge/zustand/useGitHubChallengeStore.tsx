import type { CoursePhaseParticipationWithStudent } from '@tumaet/prompt-shared-state'
import { create } from 'zustand'
import type { DeveloperProfile } from '../interfaces/DeveloperProfile'

interface GitHubChallengeStoreState {
  coursePhaseParticipation?: CoursePhaseParticipationWithStudent
  developerProfile?: DeveloperProfile
}

interface GitHubChallengeStoreActions {
  setDeveloperProfile: (developerProfile?: DeveloperProfile) => void
  setCoursePhaseParticipation: (
    coursePhaseParticipation: CoursePhaseParticipationWithStudent,
  ) => void
}

export const useGitHubChallengeStore = create<
  GitHubChallengeStoreState & GitHubChallengeStoreActions
>((set) => ({
  developerProfile: undefined,
  setDeveloperProfile: (developerProfile) => set({ developerProfile }),
  setCoursePhaseParticipation: (coursePhaseParticipation) => set({ coursePhaseParticipation }),
}))
