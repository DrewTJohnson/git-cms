import { createResource } from "solid-js";

export interface ManifestPage {
  slug: string;
  title: string;
}

const BASE = import.meta.env.BASE_URL ?? "/";

async function fetchManifest(): Promise<ManifestPage[]> {
  const res = await fetch(`${BASE}content-manifest.json`);
  if (!res.ok) return [];
  return res.json();
}

export const [manifest, { refetch: refetchManifest }] =
  createResource(fetchManifest);
