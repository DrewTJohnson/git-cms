import { createSignal } from "solid-js";
import {
  getToken,
  setToken,
  clearToken,
  getRepoConfig,
  setRepoConfig,
  clearRepoConfig,
  validateToken,
} from "../lib/auth";
import { config as buildConfig } from "../../config";

// Hydrate from localStorage
const stored = getRepoConfig();
const [token, setTokenSignal] = createSignal<string | null>(getToken());
const [repoOwner, setRepoOwner] = createSignal(
  stored?.owner ?? buildConfig.repoOwner
);
const [repoName, setRepoName] = createSignal(
  stored?.name ?? buildConfig.repoName
);
const [branch] = createSignal(buildConfig.defaultBranch);
const [authError, setAuthError] = createSignal<string | null>(null);
const [authLoading, setAuthLoading] = createSignal(false);

export const adminStore = {
  token,
  repoOwner,
  repoName,
  branch,
  authError,
  authLoading,

  isAuthenticated: () => token() !== null,

  async login(pat: string, owner: string, name: string) {
    setAuthLoading(true);
    setAuthError(null);

    const result = await validateToken(pat);
    if (!result.ok) {
      setAuthError(result.error ?? "Invalid token");
      setAuthLoading(false);
      return false;
    }

    setToken(pat);
    setTokenSignal(pat);
    setRepoConfig({ owner, name });
    setRepoOwner(owner);
    setRepoName(name);
    setAuthLoading(false);
    return true;
  },

  logout() {
    clearToken();
    clearRepoConfig();
    setTokenSignal(null);
  },
};
