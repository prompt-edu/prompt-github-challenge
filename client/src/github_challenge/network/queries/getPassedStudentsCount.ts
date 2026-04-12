import { gitHubChallengeAxiosInstance } from "../gitHubChallengeServerConfig";

export const getPassedStudentsCount = async (
  coursePhaseID: string,
): Promise<number> => {
  try {
    const response = await gitHubChallengeAxiosInstance.get(
      `/${coursePhaseID}/passed`,
    );
    return response.data.passedStudents;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
