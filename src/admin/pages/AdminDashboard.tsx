import { createResource, Show, For, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { adminStore } from "../store/adminStore";
import { listPages, deletePage, type PageEntry } from "../lib/github";
import { config } from "../../config";

export default function AdminDashboard() {
  const [deleteError, setDeleteError] = createSignal<string | null>(null);
  const [deleting, setDeleting] = createSignal<string | null>(null);

  const [pages, { refetch }] = createResource(async () => {
    const token = adminStore.token();
    if (!token) return [];
    return listPages(
      token,
      adminStore.repoOwner(),
      adminStore.repoName(),
      adminStore.branch(),
      config.contentPath
    );
  });

  async function handleDelete(page: PageEntry) {
    if (
      !confirm(
        `Delete "${page.slug}"? This will commit a deletion to your repository.`
      )
    )
      return;

    const token = adminStore.token();
    if (!token) return;

    setDeleting(page.slug);
    setDeleteError(null);

    try {
      await deletePage(
        token,
        adminStore.repoOwner(),
        adminStore.repoName(),
        adminStore.branch(),
        config.contentPath,
        page.slug,
        page.sha
      );
      refetch();
    } catch (err) {
      setDeleteError((err as { message?: string }).message ?? String(err));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div class="admin-page">
      <div class="admin-page__header">
        <div>
          <h1 class="admin-page__title">Pages</h1>
          <p class="admin-page__subtitle">
            {adminStore.repoOwner()}/{adminStore.repoName()} ·{" "}
            {adminStore.branch()}
          </p>
        </div>
        <A href="/admin/new" class="btn btn--primary">
          + New Page
        </A>
      </div>

      <Show when={deleteError()}>
        <div class="alert alert--error" role="alert">
          {deleteError()}
        </div>
      </Show>

      <Show
        when={!pages.loading}
        fallback={<p class="loading-text">Loading pages…</p>}
      >
        <Show
          when={(pages() ?? []).length > 0}
          fallback={
            <div class="empty-state">
              <p>No pages yet.</p>
              <A href="/admin/new" class="btn btn--primary">
                Create your first page
              </A>
            </div>
          }
        >
          <div class="page-table">
            <div class="page-table__head">
              <span>Slug</span>
              <span>Size</span>
              <span />
            </div>
            <For each={pages()}>
              {(page) => (
                <div class="page-table__row">
                  <span class="page-table__slug">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      class="page-table__icon"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    {page.slug}
                  </span>
                  <span class="page-table__size">
                    {(page.size / 1024).toFixed(1)} KB
                  </span>
                  <span class="page-table__actions">
                    <A
                      href={`/admin/edit/${page.slug}`}
                      class="btn btn--ghost btn--sm"
                    >
                      Edit
                    </A>
                    <button
                      class="btn btn--danger btn--sm"
                      onClick={() => handleDelete(page)}
                      disabled={deleting() === page.slug}
                      type="button"
                    >
                      {deleting() === page.slug ? "Deleting…" : "Delete"}
                    </button>
                  </span>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}
