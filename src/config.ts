/**
 * Runtime configuration derived from Vite env vars.
 * All VITE_* vars are injected at build time by GitHub Actions.
 * For local dev, copy .env.example to .env.local and fill in your values.
 */

export const config = {
  repoOwner: import.meta.env.VITE_REPO_OWNER ?? "",
  repoName: import.meta.env.VITE_REPO_NAME ?? "",
  defaultBranch: import.meta.env.VITE_DEFAULT_BRANCH ?? "main",
  contentPath: "content/pages",

  /** Base URL for fetching raw markdown files without auth */
  rawBaseUrl(slug: string): string {
    return `https://raw.githubusercontent.com/${this.repoOwner}/${this.repoName}/${this.defaultBranch}/${this.contentPath}/${slug}.md`;
  },
};
