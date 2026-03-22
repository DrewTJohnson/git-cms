import { createSignal, createResource, Show } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { adminStore } from "../store/adminStore";
import { getPage, updatePage } from "../lib/github";
import { config } from "../../config";
import MarkdownEditor from "../components/MarkdownEditor";

export default function AdminEdit() {
  const params = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [content, setContent] = createSignal("");
  const [sha, setSha] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const [saveError, setSaveError] = createSignal<string | null>(null);

  const [pageData] = createResource(async () => {
    const token = adminStore.token();
    if (!token) return null;
    const data = await getPage(
      token,
      adminStore.repoOwner(),
      adminStore.repoName(),
      adminStore.branch(),
      config.contentPath,
      params.slug
    );
    setContent(data.content);
    setSha(data.sha);
    return data;
  });

  async function handleSave(e: Event) {
    e.preventDefault();
    const token = adminStore.token();
    if (!token || !sha()) return;

    setSaving(true);
    setSaveError(null);

    try {
      await updatePage(
        token,
        adminStore.repoOwner(),
        adminStore.repoName(),
        adminStore.branch(),
        config.contentPath,
        params.slug,
        content(),
        sha()
      );
      navigate("/admin");
    } catch (err) {
      setSaveError((err as { message?: string }).message ?? String(err));
      setSaving(false);
    }
  }

  return (
    <form class="admin-page admin-editor" onSubmit={handleSave}>
      <div class="admin-page__header">
        <div>
          <h1 class="admin-page__title">
            Edit <code>{params.slug}</code>
          </h1>
        </div>
        <div class="admin-editor__actions">
          <a href="/admin" class="btn btn--ghost">
            Cancel
          </a>
          <button
            type="submit"
            class="btn btn--primary"
            disabled={saving() || pageData.loading}
          >
            {saving() ? "Saving…" : "Save & Commit"}
          </button>
        </div>
      </div>

      <Show when={saveError()}>
        <div class="alert alert--error" role="alert">
          {saveError()}
        </div>
      </Show>

      <Show
        when={!pageData.loading}
        fallback={<p class="loading-text">Loading page…</p>}
      >
        <Show when={pageData.error} fallback={null}>
          <div class="alert alert--error" role="alert">
            Failed to load page: {String(pageData.error)}
          </div>
        </Show>

        <MarkdownEditor
          value={content()}
          onChange={setContent}
          class="admin-editor__editor"
        />
      </Show>
    </form>
  );
}
