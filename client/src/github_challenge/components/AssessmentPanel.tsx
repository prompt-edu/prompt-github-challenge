import { Assessment } from './Assessment'
import { PassCountIndicator } from './PassCountIndicator'
import { RepositoryInformation } from './RepositoryInformation'

export const AssessmentPanel = () => {
  return (
    <div className='grid gap-6 mt-4'>
      <RepositoryInformation />
      <Assessment />
      <PassCountIndicator />
    </div>
  )
}
