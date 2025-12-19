"use client";
import { useState, useEffect } from "react";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import { useParams } from "next/navigation";
import { products } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import Filter from "@/components/ui/Filter";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [categoryProducts, setCategoryProducts] = useState(products);
  const [sortBy, setSortBy] = useState("name");
  const [sortedProducts, setSortedProducts] = useState(products);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    subcategories: [],
  });

  useEffect(() => {
    const categoryName = slug.replace(/-/g, ' ');
    const filtered = products.filter(
      (product) => product.category.toLowerCase() === categoryName.toLowerCase()
    );
    setCategoryProducts(filtered);
  }, [slug]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  useEffect(() => {
    let tempProducts = [...categoryProducts];

    if (filters.subcategories.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        filters.subcategories.includes(product.subcategory)
      );
    }

    tempProducts = tempProducts.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
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
    setSortedProducts(tempProducts);
  }, [categoryProducts, filters, sortBy]);

  return (
    <div>
      <Navigation />
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl capitalize text-center">
            {slug.replace(/-/g, ' ')}
          </h1>
          <p className="mt-4 text-xl text-gray-600 text-center">
            Explore our curated selection of {slug.replace(/-/g, ' ')} products.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12">
            <div className="lg:col-span-1">
              <Filter
                onFilterChange={setFilters}
                products={categoryProducts}
              />
            </div>
            <div className="lg:col-span-3">
              <div className="flex justify-end mb-4">
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
      <Footer />
    </div>
  );
}
