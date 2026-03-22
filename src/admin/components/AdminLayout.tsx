import { type JSX } from "solid-js";
import { A } from "@solidjs/router";
import TokenGate from "./TokenGate";
import { adminStore } from "../store/adminStore";

interface Props {
  children: JSX.Element;
}

export default function AdminLayout(props: Props) {
  return (
    <TokenGate>
      <div class="admin-shell">
        <header class="admin-header">
          <div class="admin-header__inner">
            <A href="/admin" class="admin-header__brand">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="admin-header__logo"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Git CMS
            </A>
            <nav class="admin-header__nav">
              <A href="/" class="admin-header__link" target="_blank">
                View Site ↗
              </A>
              <button
                class="btn btn--ghost btn--sm"
                onClick={() => adminStore.logout()}
                type="button"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </header>

        <main class="admin-main">{props.children}</main>
      </div>
    </TokenGate>
  );
}
