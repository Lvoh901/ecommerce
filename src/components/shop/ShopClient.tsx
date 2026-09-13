"use client";

import { useMemo, useState, useCallback } from "react";
import ProductCard from "@/components/ui/ProductCard";
import Filter from "@/components/ui/Filter";
import type { Product } from "@prisma/client";

interface FiltersType {
  priceRange: [number, number];
  subcategories: string[];
  categories: string[];
}

import { useSearchParams } from "next/navigation";

export default function ShopClient({
  products,
  allCategories,
}: {
  products: Product[];
  allCategories: string[];
}) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [sortBy, setSortBy] = useState<string>("name");

  // Calculate global min/max for initial state (guarded: empty list => sane default)
  const minPrice = useMemo(
    () => (products.length > 0 ? Math.min(...products.map((p) => p.price)) : 0),
    [products],
  );
  const maxPrice = useMemo(
    () =>
      products.length > 0 ? Math.max(...products.map((p) => p.price)) : 1000,
    [products],
  );

  const [filters, setFilters] = useState<FiltersType>({
    priceRange: [minPrice, maxPrice],
    subcategories: [],
    categories: [],
  });

  const handleFilterChange = useCallback(
    (newFilters: {
      priceRange: number[];
      subcategories: string[];
      categories?: string[];
    }) => {
      if (
        Array.isArray(newFilters.priceRange) &&
        newFilters.priceRange.length === 2 &&
        typeof newFilters.priceRange[0] === "number" &&
        typeof newFilters.priceRange[1] === "number"
      ) {
        setFilters((prev) => {
          const next = {
            ...prev,
            subcategories: newFilters.subcategories,
            priceRange: [
              newFilters.priceRange[0],
              newFilters.priceRange[1],
            ] as [number, number],
            categories: newFilters.categories || prev.categories,
          };
          // Skip state update when nothing changed (breaks render ping-pong)
          if (
            prev.priceRange[0] === next.priceRange[0] &&
            prev.priceRange[1] === next.priceRange[1] &&
            prev.subcategories.length === next.subcategories.length &&
            prev.subcategories.every((s, i) => s === next.subcategories[i]) &&
            prev.categories.length === next.categories.length &&
            prev.categories.every((c, i) => c === next.categories[i])
          ) {
            return prev;
          }
          return next;
        });
      }
    },
    [],
  );

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const sortedProducts = useMemo(() => {
    let tempProducts = [...products];

    // Filter by Search Query
    if (searchQuery) {
      tempProducts = tempProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by Category
    if (filters.categories.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        filters.categories.includes(product.category),
      );
    }

    // Filter by Subcategory
    if (filters.subcategories.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        filters.subcategories.includes(product.subcategory),
      );
    }

    // Filter by Price
    tempProducts = tempProducts.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1],
    );

    switch (sortBy) {
      case "price-asc":
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        tempProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        tempProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return tempProducts;
  }, [products, filters, sortBy, searchQuery]);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto px-8 mt-8">
        <h3 className="font-bold text-gray-900 text-center">
          Shop All Products
        </h3>
        <p className="text-xl text-gray-600 text-center">
          Explore our complete collection of verified tech gadgets.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12">
          <div className="lg:col-span-1">
            <Filter
              onFilterChange={handleFilterChange}
              products={products}
              allCategories={allCategories}
            />
          </div>
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600 font-medium">
                {sortedProducts.length} Products Found
              </p>
              <select
                onChange={handleSortChange}
                value={sortBy}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="name">Sort by Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-lg text-gray-600">
                    No products found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
