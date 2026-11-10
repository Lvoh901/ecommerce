"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Trash2, Plus, Star } from "lucide-react";
import type { Product, Category } from "@prisma/client";
import { notify } from "@/lib/notify";
import ImageUpload from "@/components/ui/ImageUpload";
import { EmptyState, money } from "../components";
import { FilterChips, Modal, SearchField, Field, inputClass } from "../ui";

type FormState = {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  subcategory: string;
};

const EMPTY: FormState = { name: "", description: "", price: "", category: "", image: "", subcategory: "" };

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
] as const;

type SortKey = (typeof SORTS)[number]["value"];

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

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState<SortKey>("newest");

  const categoryOptions = useMemo(() => {
    const names = new Set<string>(categories.map((item) => item.name));
    products.forEach((product) => names.add(product.category));
    return ["ALL", ...[...names].sort((a, b) => a.localeCompare(b))];
  }, [categories, products]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: products.length };
    categoryOptions.forEach((name) => {
      if (name !== "ALL" && map[name] === undefined) map[name] = 0;
    });
    products.forEach((product) => {
      map[product.category] = (map[product.category] ?? 0) + 1;
    });
    return map;
  }, [products, categoryOptions]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = products.filter((product) => {
      const matchesCategory = category === "ALL" || product.category === category;
      const matchesQuery =
        !needle ||
        [product.name, product.category, product.subcategory, product.description]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return matchesCategory && matchesQuery;
    });
    return list.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.id - a.id;
    });
  }, [products, query, category, sort]);

  function openCreate() {
    setForm({ ...EMPTY, category: categories[0]?.name ?? "" });
    setCreating(true);
    setEditing(null);
    setError("");
  }

  function openEdit(product: Product) {
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      image: product.image,
      subcategory: product.subcategory,
    });
    setEditing(product);
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
        setProducts((prev) => prev.map((product) => (product.id === editing.id ? data.product : product)));
        notify.toast("Product updated");
      } else {
        setProducts((prev) => [data.product, ...prev]);
        notify.toast("Product created");
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
    const ok = await notify.confirmDelete("Delete product?", "This cannot be undone.");
    if (!ok) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      notify.error("Delete failed", "The product could not be deleted.");
      return;
    }
    setProducts((prev) => prev.filter((product) => product.id !== id));
    notify.toast("Product deleted");
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search products, categories…"
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              aria-label="Sort products"
              className="h-[42px] rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none focus:border-[#FF4500]"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={openCreate}
              className="inline-flex h-[42px] shrink-0 items-center gap-2 rounded-xl bg-[#FF4500] px-4 text-sm font-bold text-white transition-colors hover:bg-[#e03d00]"
            >
              <Plus className="h-4 w-4" /> Add product
            </button>
          </div>
        </div>
        <FilterChips
          label="Filter by category"
          value={category}
          onChange={setCategory}
          counts={counts}
          options={categoryOptions.map((name) => ({ value: name, label: name === "ALL" ? "All" : name }))}
        />
      </div>

      <p className="mt-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {visible.length} of {products.length} products
      </p>

      {visible.length === 0 ? (
        <EmptyState
          title="No products match"
          message="Try a different search term or category filter."
          action={
            <button
              onClick={() => {
                setQuery("");
                setCategory("ALL");
              }}
              className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Reset filters
            </button>
          }
        />
      ) : (
        <>
          {/* Mobile cards */}
          <ul className="space-y-2 md:hidden">
            {visible.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <Image src={product.image} alt={product.name} fill className="object-cover" sizes="56px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900">{product.name}</p>
                  <p className="truncate text-xs text-gray-500">
                    {product.category}
                    {product.subcategory ? ` · ${product.subcategory}` : ""}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">
                    {money(product.price)}
                    <span className="ml-2 inline-flex items-center gap-0.5 text-[11px] font-medium text-amber-600">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      {product.rating} ({product.reviews})
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    onClick={() => openEdit(product)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                    aria-label={`Edit ${product.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-lg border border-red-100 bg-red-50/50 p-2 text-red-600 hover:bg-red-50"
                    aria-label={`Delete ${product.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Rating</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visible.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-gray-50/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          {product.subcategory && (
                            <p className="text-xs text-gray-400">{product.subcategory}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold tabular-nums text-gray-900">
                      {money(product.price)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        {product.rating}
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal
        open={creating || Boolean(editing)}
        onClose={closeModal}
        title={editing ? "Edit product" : "New product"}
        description={editing ? `#${editing.id} · ${editing.name}` : "Add a listing to the storefront."}
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
              form="product-form"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF4500] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#e03d00] disabled:opacity-60"
            >
              {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
            </button>
          </div>
        }
      >
        {error && (
          <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
        )}
        <form id="product-form" onSubmit={handleSave} className="space-y-3">
          <Field label="Name">
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="e.g. MacBook Air M3"
              className={inputClass}
            />
          </Field>
          <Field label="Description">
            <textarea
              required
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="What makes this product worth buying?"
              rows={3}
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price" hint="Ksh">
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                placeholder="0"
                className={inputClass}
              />
            </Field>
            <Field label="Subcategory" hint="Optional">
              <input
                value={form.subcategory}
                onChange={(event) => setForm({ ...form, subcategory: event.target.value })}
                placeholder="e.g. Laptops"
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Category">
            <select
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              className={inputClass}
            >
              <option value="">Select category…</option>
              {categories.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Product image">
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          </Field>
        </form>
      </Modal>
    </div>
  );
}
