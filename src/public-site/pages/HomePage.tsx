import { createResource, Show } from "solid-js";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { config } from "../../config";

export default function HomePage() {
  const [content] = createResource(async () => {
    const url = config.rawBaseUrl("home");
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.text();
  });

  return (
    <div class="content-page">
      <Show
        when={!content.loading}
        fallback={<div class="loading-text">Loading…</div>}
      >
        <Show
          when={content() !== null}
          fallback={
            <div class="prose">
              <h1>Welcome</h1>
              <p>This site is just getting started. Check back soon!</p>
            </div>
          }
        >
          <MarkdownRenderer content={content()!} />
        </Show>
      </Show>
    </div>
  );
}
