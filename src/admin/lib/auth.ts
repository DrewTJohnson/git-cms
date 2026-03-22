const TOKEN_KEY = "git_cms_token";
const REPO_OWNER_KEY = "git_cms_repo_owner";
const REPO_NAME_KEY = "git_cms_repo_name";

export interface RepoConfig {
  owner: string;
  name: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getRepoConfig(): RepoConfig | null {
  const owner = localStorage.getItem(REPO_OWNER_KEY);
  const name = localStorage.getItem(REPO_NAME_KEY);
  if (owner && name) return { owner, name };
  return null;
}

export function setRepoConfig(config: RepoConfig): void {
  localStorage.setItem(REPO_OWNER_KEY, config.owner);
  localStorage.setItem(REPO_NAME_KEY, config.name);
}

export function clearRepoConfig(): void {
  localStorage.removeItem(REPO_OWNER_KEY);
  localStorage.removeItem(REPO_NAME_KEY);
}

export interface ValidateResult {
  ok: boolean;
  username?: string;
  error?: string;
}

/** Makes a GET /user call to verify the PAT is valid */
export async function validateToken(token: string): Promise<ValidateResult> {
  try {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        ok: false,
        error: (body as { message?: string }).message ?? `HTTP ${res.status}`,
      };
    }

    const user = (await res.json()) as { login: string };
    return { ok: true, username: user.login };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
