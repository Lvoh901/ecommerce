"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import type { Category } from "@prisma/client";
import { notify } from "@/lib/notify";
import ImageUpload from "@/components/ui/ImageUpload";

type FormState = { name: string; fromPrice: string; image: string; link: string; description: string };
const EMPTY: FormState = { name: "", fromPrice: "", image: "", link: "/shop", description: "" };

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openCreate() {
    setForm(EMPTY);
    setCreating(true);
    setEditing(null);
    setError("");
  }

  function openEdit(c: Category) {
    setForm({ name: c.name, fromPrice: String(c.fromPrice), image: c.image, link: c.link, description: c.description ?? "" });
    setEditing(c);
    setCreating(false);
    setError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
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
        setCategories((prev) => prev.map((c) => (c.id === editing.id ? data.category : c)));
        notify.toast("Category updated");
      } else {
        setCategories((prev) => [...prev, data.category]);
        notify.toast("Category created");
      }
      setCreating(false);
      setEditing(null);
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const ok = await notify.confirmDelete(
      "Delete category?",
      "Products using its name will keep the text value."
    );
    if (!ok) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      notify.error("Delete failed", "The category could not be deleted.");
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    notify.toast("Category deleted");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4">
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-[#FF4500] hover:bg-orange-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add category
        </button>
      </div>

      {(creating || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{editing ? "Edit category" : "New category"}</h2>
              <button onClick={() => { setCreating(false); setEditing(null); }} className="p-1.5 rounded-lg hover:bg-gray-100" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-3">{error}</p>}
            <form onSubmit={handleSave} className="space-y-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category name" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF4500] outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" min="0" step="0.01" value={form.fromPrice} onChange={(e) => setForm({ ...form, fromPrice: e.target.value })} placeholder="From price (Ksh)" className="px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF4500] outline-none" />
                <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Link (/shop)" className="px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF4500] outline-none" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1.5">Category image</p>
                <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
              </div>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF4500] outline-none" />
              <button type="submit" disabled={saving} className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl">
                {saving ? "Saving…" : editing ? "Save changes" : "Create category"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">From</th>
              <th className="px-4 py-3 font-semibold">Link</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image src={c.image} alt={c.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <span className="font-semibold text-gray-900">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">Ksh.{c.fromPrice.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500">{c.link}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" aria-label={`Edit ${c.name}`}>
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600" aria-label={`Delete ${c.name}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-500">No categories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
