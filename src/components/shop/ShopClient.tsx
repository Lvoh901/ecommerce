"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ChevronRight,
  PackageSearch,
  SlidersHorizontal,
  X,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import Filter, { type ShopFilters } from "@/components/ui/Filter";
import type { Product } from "@prisma/client";

export default function ShopClient({
  products,
  allCategories,
}: {
  products: Product[];
  allCategories: string[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchQuery = (searchParams.get("q") || "").trim();
  const categoryParam = searchParams.get("category");

  const minPrice = useMemo(
    () =>
      products.length > 0
        ? Math.floor(Math.min(...products.map((p) => p.price)))
        : 0,
    [products],
  );
  const maxPrice = useMemo(
    () =>
      products.length > 0
        ? Math.ceil(Math.max(...products.map((p) => p.price)))
        : 1000,
    [products],
  );

  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Category selection is remembered alongside the URL param it came from, so a
  // different ?category= link re-seeds it during render (no sync effect needed).
  const [categoryState, setCategoryState] = useState(() => ({
    param: categoryParam,
    list: categoryParam ? [categoryParam] : [],
  }));
  const categories = useMemo(
    () =>
      categoryState.param === categoryParam
        ? categoryState.list
        : categoryParam
          ? [categoryParam]
          : [],
    [categoryState, categoryParam],
  );

  const filters: ShopFilters = useMemo(
    () => ({ priceRange, subcategories, categories }),
    [priceRange, subcategories, categories],
  );

  const syncCategoryToUrl = (next: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    const single = next.length === 1 ? next[0] : null;
    if (single) params.set("category", single);
    else params.delete("category");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggleCategory = (category: string) => {
    const next = categories.includes(category)
      ? categories.filter((c) => c !== category)
      : [...categories, category];
    setCategoryState({
      param: next.length === 1 ? next[0] : null,
      list: next,
    });
    syncCategoryToUrl(next);
  };

  const toggleSubcategory = (subcategory: string) => {
    setSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory],
    );
  };

  const clearFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSubcategories([]);
    setCategoryState({ param: null, list: [] });
    syncCategoryToUrl([]);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const sortedProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery) {
      const needle = searchQuery.toLowerCase();
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(needle) ||
          product.description.toLowerCase().includes(needle) ||
          product.category.toLowerCase().includes(needle) ||
          product.subcategory.toLowerCase().includes(needle),
      );
    }

    if (filters.categories.length > 0) {
      list = list.filter((product) =>
        filters.categories.includes(product.category),
      );
    }

    if (filters.subcategories.length > 0) {
      list = list.filter((product) =>
        filters.subcategories.includes(product.subcategory),
      );
    }

    list = list.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1],
    );

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      default:
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  }, [products, filters, sortBy, searchQuery]);

  const activeFilterCount =
    filters.categories.length +
    filters.subcategories.length +
    (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice
      ? 1
      : 0);

  const heading =
    filters.categories.length === 1 ? filters.categories[0] : "All Products";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="relative overflow-hidden border-b border-gray-200 bg-white">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-60" />
        <div className="pointer-events-none absolute -top-24 right-0 h-56 w-72 rounded-full bg-[#FF4500]/10 blur-[90px]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-gray-500"
          >
            <Link href="/" className="hover:text-[#FF4500]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-900">{heading}</span>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="eyebrow mb-2">KonnectTech catalog</span>
              <h2 className="text-gray-900">{heading}</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-600 sm:text-base">
                Verified gadgets, accessories and gear — quality-checked, with
                free delivery within Nairobi.
              </p>
            </div>
            <div className="hidden rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-right sm:block text-sm">
              <span className="italic font-bold">{sortedProducts.length}</span>{" "}
              Products
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[16rem_1fr] lg:gap-8">
          {/* Filters: sidebar on desktop, collapsible on mobile */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className="mb-2 flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 lg:hidden"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#FF4500]" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-[#FF4500] px-2 py-0.5 text-[10px] font-extrabold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </span>
              <span className="text-xs font-semibold text-gray-500">
                {showFilters ? "Hide" : "Show"}
              </span>
            </button>
            <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <Filter
                products={products}
                allCategories={allCategories}
                filters={filters}
                onPriceChange={setPriceRange}
                onToggleCategory={toggleCategory}
                onToggleSubcategory={toggleSubcategory}
                onClear={clearFilters}
              />
            </div>
          </aside>

          {/* Results */}
          <section aria-label="Products">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                {searchQuery ? (
                  <span className="flex max-w-full items-center gap-1.5 rounded-full bg-[#FF4500]/10 px-3 py-1 text-xs font-bold text-[#FF4500]">
                    <span className="truncate">“{searchQuery}”</span>
                    <button
                      type="button"
                      onClick={clearSearch}
                      aria-label="Clear search"
                      className="hover:opacity-70"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ) : (
                  <p className="text-xs font-semibold text-gray-600 sm:text-sm">
                    Showing{" "}
                    <span className="font-extrabold text-gray-900">
                      {sortedProducts.length}
                    </span>{" "}
                    of {products.length} items
                  </p>
                )}
                {filters.categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:bg-gray-200"
                  >
                    {category}
                    <X className="h-3 w-3" />
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span className="hidden sm:inline">Sort</span>
                <select
                  onChange={(e) => setSortBy(e.target.value)}
                  value={sortBy}
                  className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-800 focus:border-[#FF4500] focus:outline-none"
                >
                  <option value="featured">Name (A–Z)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top rated</option>
                </select>
              </label>
            </div>

            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                <PackageSearch className="mb-4 h-10 w-10 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-900">
                  No products match those filters
                </h3>
                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  Try widening the price range or removing a category to see
                  more of the catalog.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    clearFilters();
                    clearSearch();
                  }}
                  className="btn-primary mt-5 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
                >
                  Reset filters
                </button>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Can&apos;t find what you need?
                </p>
                <p className="text-xs text-gray-500">
                  We source devices on request and repair what you already own.
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/contact"
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Ask us
                </Link>
                <Link
                  href="/book-service"
                  className="btn-primary flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white"
                >
                  Book repair <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
