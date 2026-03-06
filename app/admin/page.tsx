"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import {
  Box,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  clearAdminSecret,
  getAdminSecret,
  useHasAdminAccess,
} from "@/components/AdminNavLink";
import {
  adminCreatePage,
  adminDeletePage,
  adminGetUploadUrl,
  adminUpdatePage,
} from "@/lib/adminPagesApi";
import { RichTextBodyEditor } from "@/components/RichTextBodyEditor";
import { fetchPages } from "@/lib/pagesApi";
import { marked } from "marked";
import type { PageItem } from "@/lib/pagesApi";
import { s3Image } from "@/lib/site";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function AdminPageContent() {
  const hasAccess = useHasAdminAccess();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tips, setTips] = useState<PageItem[]>([]);
  const [projects, setProjects] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [editing, setEditing] = useState<PageItem | null>(null);
  const [formType, setFormType] = useState<"tip" | "project">("tip");
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formImageKeys, setFormImageKeys] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragMain, setDragMain] = useState(false);
  const [dragGallery, setDragGallery] = useState(false);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const loadPages = useCallback(async () => {
    setLoading(true);
    const [t, p] = await Promise.all([
      fetchPages({ type: "tip" }),
      fetchPages({ type: "project" }),
    ]);
    setTips(t);
    setProjects(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (hasAccess) loadPages();
  }, [hasAccess, loadPages]);

  // Open edit modal when navigated with ?edit=pageId (e.g. from Edit on tip/project page)
  useEffect(() => {
    const editId = searchParams.get("edit");
    if (!editId || loading) return;
    const all = [...tips, ...projects];
    const page = all.find((p) => p.page_id === editId);
    if (page) {
      openEdit(page);
      router.replace("/admin");
    }
  }, [loading, tips, projects, searchParams, router]);

  const handleLogout = () => {
    clearAdminSecret();
    setTips([]);
    setProjects([]);
  };

  const openCreate = (type: "tip" | "project") => {
    setEditing(null);
    setFormType(type);
    setFormTitle("");
    setFormSlug("");
    setFormDescription("");
    setFormBody("");
    setFormImageKeys([]);
    openForm();
  };

  const openEdit = (page: PageItem) => {
    setEditing(page);
    setFormType(page.type as "tip" | "project");
    setFormTitle(page.title);
    setFormSlug(page.slug);
    setFormDescription(page.description ?? "");
    const body = page.body ?? "";
    const bodyHtml =
      body.trimStart().startsWith("<") ? body : marked.parse(body, { async: false }) as string;
    setFormBody(bodyHtml);
    setFormImageKeys(page.image_keys ?? []);
    openForm();
  };

  const handleSave = async () => {
    const s = getAdminSecret();
    if (!s) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await adminUpdatePage(s, editing.page_id, {
          type: formType,
          slug: formSlug.trim(),
          title: formTitle.trim(),
          body: formBody,
          description: formDescription.trim() || undefined,
          image_keys: formImageKeys,
        });
        if (updated) {
          await loadPages();
          closeForm();
        }
      } else {
        const created = await adminCreatePage(s, {
          type: formType,
          slug: formSlug.trim(),
          title: formTitle.trim(),
          body: formBody,
          description: formDescription.trim() || undefined,
          image_keys: formImageKeys,
        });
        if (created) {
          await loadPages();
          closeForm();
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (page: PageItem) => {
    if (!confirm(`Delete "${page.title}"?`)) return;
    const s = getAdminSecret();
    if (!s) return;
    const ok = await adminDeletePage(s, page.page_id);
    if (ok) await loadPages();
  };

  const uploadOneFile = useCallback(async (file: File): Promise<string | null> => {
    const s = getAdminSecret();
    if (!s) return null;
    const result = await adminGetUploadUrl(s, file.name, file.type);
    if (!result) return null;
    const putRes = await fetch(result.upload_url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    if (!putRes.ok) return null;
    return result.key;
  }, []);

  const handleMainImage = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setUploading(true);
      try {
        const key = await uploadOneFile(file);
        if (key) setFormImageKeys((prev) => [key, ...prev.slice(1)]);
      } finally {
        setUploading(false);
      }
    },
    [uploadOneFile]
  );

  const handleGalleryImages = useCallback(
    async (files: File[]) => {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (!imageFiles.length) return;
      setUploading(true);
      try {
        const newKeys: string[] = [];
        for (const file of imageFiles) {
          const key = await uploadOneFile(file);
          if (key) newKeys.push(key);
        }
        if (newKeys.length) setFormImageKeys((prev) => [...prev, ...newKeys]);
      } finally {
        setUploading(false);
      }
    },
    [uploadOneFile]
  );

  const handleMainDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragMain(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleMainImage(f);
    },
    [handleMainImage]
  );

  const handleGalleryDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragGallery(false);
      const files = e.dataTransfer.files;
      if (files?.length) handleGalleryImages(Array.from(files));
    },
    [handleGalleryImages]
  );

  const dropZoneBase = "rounded-lg border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 py-6 px-4";
  const dropZoneIdle = "border-zinc-300 bg-zinc-50 hover:border-sky-400 hover:bg-sky-50/50";
  const dropZoneActive = "border-sky-500 bg-sky-100";

  if (!hasAccess) {
    return (
      <Box p="xl" maw={480} mx="auto">
        <Title order={2} mb="md">Admin</Title>
        <Text size="sm" c="dimmed" mb="md">
          To access admin, set the following in localStorage (DevTools → Application → Local Storage), then refresh.
        </Text>
        <Stack gap="xs">
          <Text size="sm" fw={600}>Key:</Text>
          <Text ff="monospace" size="sm" className="rounded bg-zinc-100 px-2 py-1">admin_pages_secret</Text>
          <Text size="sm" fw={600} mt="sm">Value:</Text>
          <Text size="sm">Your <code>ADMIN_PAGES_SECRET</code> from .env.local (same value used by job-engine).</Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box p="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Admin – Tips & Projects</Title>
        <Group>
          <Button variant="light" onClick={handleLogout}>Log out</Button>
          <Button onClick={() => openCreate("tip")}>Add tip</Button>
          <Button onClick={() => openCreate("project")}>Add project</Button>
        </Group>
      </Group>

      {loading ? (
        <Loader />
      ) : (
        <Stack gap="xl">
          <div>
            <Title order={3} mb="md">Tips</Title>
            <Stack gap="sm">
              {tips.map((p) => (
                <Card key={p.page_id} withBorder padding="sm">
                  <Group justify="space-between">
                    <Link href={`/home-painting-tips/${p.slug}`} className="text-sky-600 hover:underline">
                      {p.title}
                    </Link>
                    <Group>
                      <Button size="xs" variant="subtle" onClick={() => openEdit(p)}>Edit</Button>
                      <Button size="xs" color="red" variant="subtle" onClick={() => handleDelete(p)}>Delete</Button>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          </div>
          <div>
            <Title order={3} mb="md">Projects</Title>
            <Stack gap="sm">
              {projects.map((p) => (
                <Card key={p.page_id} withBorder padding="sm">
                  <Group justify="space-between">
                    <Link href={`/latest-projects/${p.slug}`} className="text-sky-600 hover:underline">
                      {p.title}
                    </Link>
                    <Group>
                      <Button size="xs" variant="subtle" onClick={() => openEdit(p)}>Edit</Button>
                      <Button size="xs" color="red" variant="subtle" onClick={() => handleDelete(p)}>Delete</Button>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          </div>
        </Stack>
      )}

      <Modal opened={formOpen} onClose={closeForm} title={editing ? "Edit page" : "New page"} size="lg">
        <Stack>
          <TextInput label="Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
          <TextInput label="Slug" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} required />
          <TextInput label="Description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
          <RichTextBodyEditor
            key={editing?.page_id ?? "new"}
            label="Body"
            value={formBody}
            onChange={setFormBody}
            placeholder="Write content…"
          />

          <Box>
            <Text size="sm" fw={600} mb="xs">Main image</Text>
            <input
              ref={mainInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleMainImage(f);
                e.target.value = "";
              }}
            />
            <Box
              className={`${dropZoneBase} ${dragMain ? dropZoneActive : dropZoneIdle} ${uploading ? "opacity-60 pointer-events-none" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragMain(true); }}
              onDragLeave={() => setDragMain(false)}
              onDrop={handleMainDrop}
              onClick={() => mainInputRef.current?.click()}
            >
              {formImageKeys[0] ? (
                <>
                  <img src={s3Image(formImageKeys[0])} alt="" className="max-h-32 w-auto rounded object-contain" />
                  <Text size="xs" c="dimmed">Click or drop to replace</Text>
                </>
              ) : (
                <>
                  <Text size="sm" fw={500} c="dimmed">Drop image here or click to browse</Text>
                  <Text size="xs" c="dimmed">Used as the main hero image</Text>
                </>
              )}
            </Box>
          </Box>

          <Box>
            <Text size="sm" fw={600} mb="xs">Gallery (optional)</Text>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const files = e.target.files;
                if (files?.length) handleGalleryImages(Array.from(files));
                e.target.value = "";
              }}
            />
            <Box
              className={`${dropZoneBase} ${dragGallery ? dropZoneActive : dropZoneIdle} ${uploading ? "opacity-60 pointer-events-none" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragGallery(true); }}
              onDragLeave={() => setDragGallery(false)}
              onDrop={handleGalleryDrop}
              onClick={() => galleryInputRef.current?.click()}
            >
              <Text size="sm" fw={500} c="dimmed">Drop images here or click to browse</Text>
              <Text size="xs" c="dimmed">Additional images shown in order</Text>
              {formImageKeys.length > 1 && (
                <Group gap="xs" mt="sm" wrap="wrap">
                  {formImageKeys.slice(1).map((key) => (
                    <Box key={key} className="rounded overflow-hidden border border-zinc-200">
                      <img src={s3Image(key)} alt="" className="w-16 h-16 object-cover" />
                    </Box>
                  ))}
                </Group>
              )}
            </Box>
          </Box>
          <Group mt="md">
            <Button onClick={handleSave} loading={saving}>Save</Button>
            <Button variant="subtle" onClick={closeForm}>Cancel</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <Box p="xl">
        <Loader />
      </Box>
    }>
      <AdminPageContent />
    </Suspense>
  );
}
