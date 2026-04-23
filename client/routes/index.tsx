import { ExtendedRouteObject, Role } from '@tumaet/prompt-shared-state'
import { GitHubChallengePage } from '../src/github_challenge/GitHubChallengePage'
import { GitHubChallengeDataShell } from '../src/github_challenge/GitHubChallengeDataShell'
import { ResultsOverviewPage } from '../src/github_challenge/pages/ResultsOverviewPage/ResultsOverviewPage'
import { MailingPage } from '../src/github_challenge/pages/Mailing/MailingPage'

const routes: ExtendedRouteObject[] = [
  {
    path: '',
    element: (
      <GitHubChallengeDataShell>
        <GitHubChallengePage />
      </GitHubChallengeDataShell>
    ),
    requiredPermissions: [Role.PROMPT_ADMIN, Role.COURSE_LECTURER, Role.COURSE_STUDENT],
  },
  {
    path: '/results-overview',
    element: <ResultsOverviewPage />,
    requiredPermissions: [Role.PROMPT_ADMIN, Role.COURSE_LECTURER],
  },
  {
    path: '/mailing',
    element: <MailingPage />,
    requiredPermissions: [Role.PROMPT_ADMIN, Role.COURSE_LECTURER],
  },
]

export default routes
