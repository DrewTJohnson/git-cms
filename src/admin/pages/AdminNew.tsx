import { createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { adminStore } from "../store/adminStore";
import { createPage } from "../lib/github";
import { config } from "../../config";
import MarkdownEditor from "../components/MarkdownEditor";

const DEFAULT_CONTENT = `# Page Title

Write your content here using Markdown.

## Section Heading

Add paragraphs, lists, and more.

- Item one
- Item two
- Item three
`;

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminNew() {
  const navigate = useNavigate();
  const [slug, setSlug] = createSignal("");
  const [slugTouched, setSlugTouched] = createSignal(false);
  const [content, setContent] = createSignal(DEFAULT_CONTENT);
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  function handleTitleInput(raw: string) {
    if (!slugTouched()) {
      setSlug(toSlug(raw));
    }
  }

  // Keep slug in sync with first heading in editor
  function handleContentChange(val: string) {
    setContent(val);
    if (!slugTouched()) {
      const match = val.match(/^#\s+(.+)$/m);
      if (match) setSlug(toSlug(match[1]));
    }
  }

  async function handleSave(e: Event) {
    e.preventDefault();
    const token = adminStore.token();
    if (!token || !slug()) return;

    setSaving(true);
    setError(null);

    try {
      await createPage(
        token,
        adminStore.repoOwner(),
        adminStore.repoName(),
        adminStore.branch(),
        config.contentPath,
        slug(),
        content()
      );
      navigate("/admin");
    } catch (err) {
      setError((err as { message?: string }).message ?? String(err));
      setSaving(false);
    }
  }

  // Warn on unsaved changes
  function handleBeforeUnload(e: BeforeUnloadEvent) {
    e.preventDefault();
  }

  return (
    <form class="admin-page admin-editor" onSubmit={handleSave}>
      <div class="admin-page__header">
        <div>
          <h1 class="admin-page__title">New Page</h1>
        </div>
        <div class="admin-editor__actions">
          <a href="/admin" class="btn btn--ghost">
            Cancel
          </a>
          <button type="submit" class="btn btn--primary" disabled={saving()}>
            {saving() ? "Saving…" : "Save & Commit"}
          </button>
        </div>
      </div>

      <Show when={error()}>
        <div class="alert alert--error" role="alert">
          {error()}
        </div>
      </Show>

      <div class="form-group">
        <label class="form-label" for="slug">
          Page Slug (URL)
        </label>
        <div class="slug-input-row">
          <span class="slug-input-prefix">/page/</span>
          <input
            id="slug"
            class="form-input"
            type="text"
            value={slug()}
            onInput={(e) => {
              setSlug(e.currentTarget.value);
              setSlugTouched(true);
            }}
            placeholder="about-us"
            pattern="[a-z0-9-]+"
            title="Lowercase letters, numbers, and hyphens only"
            required
          />
        </div>
        <p class="form-hint">
          Filename will be <code>{slug() || "page-slug"}.md</code>
        </p>
      </div>

      <MarkdownEditor
        value={content()}
        onChange={handleContentChange}
        class="admin-editor__editor"
      />
    </form>
  );
}
