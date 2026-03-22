import { Show, createSignal, type JSX } from "solid-js";
import { adminStore } from "../store/adminStore";
import { config as buildConfig } from "../../config";

interface Props {
  children: JSX.Element;
}

export default function TokenGate(props: Props) {
  const [pat, setPat] = createSignal("");
  const [owner, setOwner] = createSignal(buildConfig.repoOwner);
  const [repoName, setRepoName] = createSignal(buildConfig.repoName);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    await adminStore.login(pat().trim(), owner().trim(), repoName().trim());
  }

  return (
    <Show when={adminStore.isAuthenticated()} fallback={<LoginForm />}>
      {props.children}
    </Show>
  );

  function LoginForm() {
    return (
      <div class="token-gate">
        <div class="token-gate__card">
          <div class="token-gate__header">
            <svg
              class="token-gate__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <h1 class="token-gate__title">Admin Login</h1>
            <p class="token-gate__subtitle">
              Enter your GitHub Personal Access Token to manage content.
            </p>
          </div>

          <form onSubmit={handleSubmit} class="token-gate__form">
            <div class="form-group">
              <label class="form-label" for="owner">
                GitHub Username / Organization
              </label>
              <input
                id="owner"
                class="form-input"
                type="text"
                value={owner()}
                onInput={(e) => setOwner(e.currentTarget.value)}
                placeholder="your-username"
                required
                autocomplete="username"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="repo">
                Repository Name
              </label>
              <input
                id="repo"
                class="form-input"
                type="text"
                value={repoName()}
                onInput={(e) => setRepoName(e.currentTarget.value)}
                placeholder="my-nonprofit-site"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="pat">
                Personal Access Token
              </label>
              <input
                id="pat"
                class="form-input"
                type="password"
                value={pat()}
                onInput={(e) => setPat(e.currentTarget.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                required
                autocomplete="current-password"
              />
              <p class="form-hint">
                Needs <code>repo</code> scope (or <code>public_repo</code> for
                public repos).{" "}
                <a
                  href="https://github.com/settings/tokens/new?scopes=public_repo&description=Git+CMS"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link"
                >
                  Create one on GitHub →
                </a>
              </p>
            </div>

            <Show when={adminStore.authError()}>
              <div class="alert alert--error" role="alert">
                {adminStore.authError()}
              </div>
            </Show>

            <button
              type="submit"
              class="btn btn--primary btn--full"
              disabled={adminStore.authLoading()}
            >
              {adminStore.authLoading() ? "Verifying…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }
}
