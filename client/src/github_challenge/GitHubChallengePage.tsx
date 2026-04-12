import { GithubUsernameInput } from "./components/GithubUsernameInput";
import { AssessmentPanel } from "./components/AssessmentPanel";
import { useGitHubChallengeStore } from "./zustand/useGitHubChallengeStore";

export const GitHubChallengePage = () => {
  const { developerProfile } = useGitHubChallengeStore();

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl font-bold">GitHub Challenge</h1>
        <p className="text-gray-500">
          Complete the tasks to demonstrate your GitHub Challenge skills
        </p>
      </div>

      <div className="space-y-6">
        {!developerProfile ? <GithubUsernameInput /> : <AssessmentPanel />}
      </div>
    </div>
  );
};
