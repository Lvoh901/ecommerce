"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import type { Product, Category } from "@prisma/client";
import { notify } from "@/lib/notify";
import ImageUpload from "@/components/ui/ImageUpload";

type FormState = {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  subcategory: string;
};

const EMPTY: FormState = { name: "", description: "", price: "", category: "", image: "", subcategory: "" };

export default function ProductManager({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openCreate() {
    setForm({ ...EMPTY, category: categories[0]?.name ?? "" });
    setCreating(true);
    setEditing(null);
    setError("");
  }

  function openEdit(p: Product) {
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      category: p.category,
      image: p.image,
      subcategory: p.subcategory,
    });
    setEditing(p);
    setCreating(false);
    setError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, price: Number(form.price) };
      const url = editing ? `/api/products/${editing.id}` : "/api/products";
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
        setProducts((prev) => prev.map((p) => (p.id === editing.id ? data.product : p)));
        notify.toast("Product updated");
      } else {
        setProducts((prev) => [...prev, data.product]);
        notify.toast("Product created");
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
    const ok = await notify.confirmDelete("Delete product?", "This cannot be undone.");
    if (!ok) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      notify.error("Delete failed", "The product could not be deleted.");
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    notify.toast("Product deleted");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#FF4500] hover:bg-orange-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Add product
        </button>
      </div>

      {(creating || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{editing ? "Edit product" : "New product"}</h2>
              <button
                onClick={() => { setCreating(false); setEditing(null); }}
                className="p-1.5 rounded-lg hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-3">{error}</p>}
            <form onSubmit={handleSave} className="space-y-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF4500] outline-none" />
              <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF4500] outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price (Ksh)" className="px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF4500] outline-none" />
                <input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} placeholder="Subcategory" className="px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF4500] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF4500] outline-none bg-white">
                  <option value="">Select category…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1.5">Product image</p>
                <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
              </div>
              <button type="submit" disabled={saving} className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl">
                {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Rating</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <span className="font-semibold text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.category}</td>
                <td className="px-4 py-3 font-semibold">Ksh.{p.price.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">★ {p.rating} ({p.reviews})</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" aria-label={`Edit ${p.name}`}>
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600" aria-label={`Delete ${p.name}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-500">No products yet. Add your first listing.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
