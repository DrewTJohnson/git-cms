import { type JSX, Suspense } from "solid-js";
import Nav from "./Nav";

interface Props {
  children: JSX.Element;
}

export default function SiteLayout(props: Props) {
  return (
    <div class="site-shell">
      <Nav />
      <main class="site-main">
        <Suspense fallback={<div class="loading-text">Loading…</div>}>
          {props.children}
        </Suspense>
      </main>
      <footer class="site-footer">
        <div class="site-footer__inner">
          <p>
            &copy; {new Date().getFullYear()} Our Organization. All rights
            reserved.
          </p>
          <a href="/admin" class="site-footer__admin-link">
            Admin
          </a>
        </div>
      </footer>
    </div>
  );
}
