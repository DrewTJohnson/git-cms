import { Show, For, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { manifest } from "../../lib/manifest";

export default function Nav() {
  const [menuOpen, setMenuOpen] = createSignal(false);

  return (
    <nav class="site-nav">
      <div class="site-nav__inner">
        <A href="/" class="site-nav__brand">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="site-nav__logo"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span class="site-nav__brand-text">Our Organization</span>
        </A>

        {/* Desktop nav links */}
        <ul class="site-nav__links">
          <li>
            <A href="/" class="site-nav__link" end>
              Home
            </A>
          </li>
          <Show when={manifest()}>
            <For each={manifest()!.filter((p) => p.slug !== "home")}>
              {(page) => (
                <li>
                  <A href={`/page/${page.slug}`} class="site-nav__link">
                    {page.title}
                  </A>
                </li>
              )}
            </For>
          </Show>
        </ul>

        {/* Mobile hamburger */}
        <button
          class="site-nav__hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <Show when={menuOpen()}>
        <ul class="site-nav__mobile-menu">
          <li>
            <A
              href="/"
              class="site-nav__mobile-link"
              onClick={() => setMenuOpen(false)}
              end
            >
              Home
            </A>
          </li>
          <Show when={manifest()}>
            <For each={manifest()!.filter((p) => p.slug !== "home")}>
              {(page) => (
                <li>
                  <A
                    href={`/page/${page.slug}`}
                    class="site-nav__mobile-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {page.title}
                  </A>
                </li>
              )}
            </For>
          </Show>
        </ul>
      </Show>
    </nav>
  );
}
