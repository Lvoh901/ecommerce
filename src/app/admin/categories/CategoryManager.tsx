"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Trash2, Plus, ExternalLink } from "lucide-react";
import type { Category } from "@prisma/client";
import { notify } from "@/lib/notify";
import ImageUpload from "@/components/ui/ImageUpload";
import { EmptyState, money } from "../components";
import { Modal, SearchField, Field, inputClass } from "../ui";

type FormState = { name: string; fromPrice: string; image: string; link: string; description: string };
const EMPTY: FormState = { name: "", fromPrice: "", image: "", link: "/shop", description: "" };

export default function CategoryManager({
  initialCategories,
  productCounts = {},
}: {
  initialCategories: Category[];
  productCounts?: Record<string, number>;
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return categories;
    return categories.filter((category) =>
      `${category.name} ${category.description ?? ""}`.toLowerCase().includes(needle)
    );
  }, [categories, query]);

  function openCreate() {
    setForm(EMPTY);
    setCreating(true);
    setEditing(null);
    setError("");
  }

  function openEdit(category: Category) {
    setForm({
      name: category.name,
      fromPrice: String(category.fromPrice),
      image: category.image,
      link: category.link,
      description: category.description ?? "",
    });
    setEditing(category);
    setCreating(false);
    setError("");
  }

  function closeModal() {
    setCreating(false);
    setEditing(null);
    setError("");
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, fromPrice: Number(form.fromPrice) };
      const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed.");
        return;
      }
      if (editing) {
        setCategories((prev) => prev.map((item) => (item.id === editing.id ? data.category : item)));
        notify.toast("Category updated");
      } else {
        setCategories((prev) => [...prev, data.category]);
        notify.toast("Category created");
      }
      closeModal();
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const ok = await notify.confirmDelete("Delete category?", "Products using its name will keep the text value.");
    if (!ok) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      notify.error("Delete failed", "The category could not be deleted.");
      return;
    }
    setCategories((prev) => prev.filter((item) => item.id !== id));
    notify.toast("Category deleted");
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:p-4">
        <SearchField value={query} onChange={setQuery} placeholder="Search categories…" className="flex-1" />
        <button
          onClick={openCreate}
          className="inline-flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FF4500] px-4 text-sm font-bold text-white transition-colors hover:bg-[#e03d00]"
        >
          <Plus className="h-4 w-4" /> Add category
        </button>
      </div>

      <p className="mt-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {visible.length} of {categories.length} categories
      </p>

      {visible.length === 0 ? (
        <EmptyState
          title="No categories match"
          message="Categories power the storefront tiles and shop filters."
          action={
            <button
              onClick={openCreate}
              className="rounded-xl bg-[#FF4500] px-3.5 py-2 text-sm font-bold text-white hover:bg-[#e03d00]"
            >
              Add category
            </button>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((category) => {
            const count = productCounts[category.name] ?? 0;
            return (
              <li
                key={category.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-[#FF4500]/30 hover:shadow-[0_10px_30px_-16px_rgba(255,69,0,0.5)]"
              >
                <div className="relative h-28 w-full bg-gray-100">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                  <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-gray-700 backdrop-blur">
                    {count} product{count === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">From {money(category.fromPrice)}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => openEdit(category)}
                        className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        aria-label={`Edit ${category.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
                        aria-label={`Delete ${category.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {category.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs text-gray-500">{category.description}</p>
                  )}
                  <a
                    href={`${category.link}${category.link.includes("?") ? "&" : "?"}category=${encodeURIComponent(
                      category.name
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#FF4500] hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> Preview on shop
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={creating || Boolean(editing)}
        onClose={closeModal}
        title={editing ? "Edit category" : "New category"}
        description={editing ? `#${editing.id}` : "Shown on the home page and shop filters."}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="category-form"
              disabled={saving}
              className="rounded-xl bg-[#FF4500] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#e03d00] disabled:opacity-60"
            >
              {saving ? "Saving…" : editing ? "Save changes" : "Create category"}
            </button>
          </div>
        }
      >
        {error && (
          <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
        )}
        <form id="category-form" onSubmit={handleSave} className="space-y-3">
          <Field label="Name">
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="e.g. Cameras"
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="From price" hint="Ksh">
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.fromPrice}
                onChange={(event) => setForm({ ...form, fromPrice: event.target.value })}
                placeholder="0"
                className={inputClass}
              />
            </Field>
            <Field label="Link" hint="Defaults to /shop">
              <input
                value={form.link}
                onChange={(event) => setForm({ ...form, link: event.target.value })}
                placeholder="/shop"
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Description" hint="Optional">
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              rows={2}
              placeholder="Short line shown on the category tile"
              className={inputClass}
            />
          </Field>
          <Field label="Category image">
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          </Field>
        </form>
      </Modal>
    </div>
  );
}
