import axios from "axios";
import { parseURL } from "@/utils/parseURL";
import { env } from "@/env";

const gitHubChallengeServer = env.GITHUB_CHALLENGE_HOST || "";

const serverBaseUrl = parseURL(gitHubChallengeServer);

export interface Patch {
  op: "replace" | "add" | "remove" | "copy";
  path: string;
  value: string;
}

const authenticatedAxiosInstance = axios.create({
  baseURL: serverBaseUrl,
});

authenticatedAxiosInstance.interceptors.request.use((config) => {
  if (
    !!localStorage.getItem("jwt_token") &&
    localStorage.getItem("jwt_token") !== ""
  ) {
    config.headers["Authorization"] =
      `Bearer ${localStorage.getItem("jwt_token") ?? ""}`;
  }
  return config;
});

export { authenticatedAxiosInstance as gitHubChallengeAxiosInstance };
