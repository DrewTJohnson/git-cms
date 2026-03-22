/**
 * GitHub Contents API helpers.
 * All functions require a Personal Access Token with `repo` or `public_repo` scope.
 */

const API_BASE = "https://api.github.com";

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

/** UTF-8 safe base64 encode */
function encodeContent(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}

/** UTF-8 safe base64 decode */
function decodeContent(b64: string): string {
  return decodeURIComponent(escape(atob(b64)));
}

export interface PageEntry {
  slug: string;
  name: string;
  sha: string;
  size: number;
}

export interface PageContent {
  content: string;
  sha: string;
}

export interface GithubError {
  message: string;
  status: number;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    const err: GithubError = {
      message: (body as { message?: string }).message ?? res.statusText,
      status: res.status,
    };
    throw err;
  }
  return res.json() as Promise<T>;
}

/** List all markdown pages in content/pages/ */
export async function listPages(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  contentPath: string
): Promise<PageEntry[]> {
  const res = await fetch(
    `${API_BASE}/repos/${owner}/${repo}/contents/${contentPath}?ref=${branch}`,
    { headers: headers(token) }
  );

  // 404 means the directory doesn't exist yet — return empty list
  if (res.status === 404) return [];

  const files = await handleResponse<
    Array<{ name: string; sha: string; size: number; type: string }>
  >(res);

  return files
    .filter((f) => f.type === "file" && f.name.endsWith(".md"))
    .map((f) => ({
      slug: f.name.replace(/\.md$/, ""),
      name: f.name,
      sha: f.sha,
      size: f.size,
    }));
}

/** Get a single page's markdown content and SHA */
export async function getPage(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  contentPath: string,
  slug: string
): Promise<PageContent> {
  const res = await fetch(
    `${API_BASE}/repos/${owner}/${repo}/contents/${contentPath}/${slug}.md?ref=${branch}`,
    { headers: headers(token) }
  );

  const data = await handleResponse<{ content: string; sha: string }>(res);

  // GitHub returns content with newlines; strip them before decoding
  return {
    content: decodeContent(data.content.replace(/\n/g, "")),
    sha: data.sha,
  };
}

/** Create a new markdown page (fails if file already exists) */
export async function createPage(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  contentPath: string,
  slug: string,
  content: string,
  message?: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE}/repos/${owner}/${repo}/contents/${contentPath}/${slug}.md`,
    {
      method: "PUT",
      headers: headers(token),
      body: JSON.stringify({
        message: message ?? `content: add ${slug}`,
        content: encodeContent(content),
        branch,
      }),
    }
  );

  await handleResponse(res);
}

/** Update an existing markdown page */
export async function updatePage(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  contentPath: string,
  slug: string,
  content: string,
  sha: string,
  message?: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE}/repos/${owner}/${repo}/contents/${contentPath}/${slug}.md`,
    {
      method: "PUT",
      headers: headers(token),
      body: JSON.stringify({
        message: message ?? `content: update ${slug}`,
        content: encodeContent(content),
        sha,
        branch,
      }),
    }
  );

  await handleResponse(res);
}

/** Delete a markdown page */
export async function deletePage(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  contentPath: string,
  slug: string,
  sha: string,
  message?: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE}/repos/${owner}/${repo}/contents/${contentPath}/${slug}.md`,
    {
      method: "DELETE",
      headers: headers(token),
      body: JSON.stringify({
        message: message ?? `content: delete ${slug}`,
        sha,
        branch,
      }),
    }
  );

  await handleResponse(res);
}
