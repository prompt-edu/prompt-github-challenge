import { gitHubChallengeAxiosInstance } from "../gitHubChallengeServerConfig";

interface RepositoryResponse {
  message: string;
  repositoryUrl: string;
}

export const createRepository = async (
  githubUsername: string,
  coursePhaseID: string,
): Promise<void> => {
  try {
    const payload = {
      GithubUsername: githubUsername,
    };

    await gitHubChallengeAxiosInstance.post<RepositoryResponse>(
      `${coursePhaseID}/repository`,
      payload,
      {
        headers: {
          "Content-Type": "application/json-path+json",
        },
      },
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};
