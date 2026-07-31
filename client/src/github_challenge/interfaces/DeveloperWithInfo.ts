export interface DeveloperWithInfo {
  courseParticipationID: string
  attempts: number
  hasPassed: boolean
  passedAt: Date | null
  passingPosition?: number
}
