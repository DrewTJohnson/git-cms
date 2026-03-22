import { A } from "@solidjs/router";

export default function NotFoundPage() {
  return (
    <div class="not-found">
      <h1>404 — Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <A href="/" class="btn btn--primary">
        Go Home
      </A>
    </div>
  );
}
