import { createResource, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { config } from "../../config";

export default function ContentPage() {
  const params = useParams<{ slug: string }>();

  const [content] = createResource(
    () => params.slug,
    async (slug) => {
      const url = config.rawBaseUrl(slug);
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    }
  );

  return (
    <div class="content-page">
      <Show
        when={!content.loading}
        fallback={<div class="loading-text">Loading…</div>}
      >
        <Show
          when={content() !== null && content() !== undefined}
          fallback={
            <div class="not-found">
              <h1>Page Not Found</h1>
              <p>The page <code>{params.slug}</code> does not exist.</p>
              <a href="/" class="btn btn--primary">
                Go Home
              </a>
            </div>
          }
        >
          <Show
            when={!content.error}
            fallback={
              <div class="alert alert--error">
                Failed to load this page. Please try again.
              </div>
            }
          >
            <MarkdownRenderer content={content()!} />
          </Show>
        </Show>
      </Show>
    </div>
  );
}
