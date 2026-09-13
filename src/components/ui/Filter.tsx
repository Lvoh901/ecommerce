'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Range } from 'react-range';
import type { Product } from '@prisma/client';

interface FilterProps {
  onFilterChange: (filters: { priceRange: number[]; subcategories: string[]; categories?: string[] }) => void;
  products: Product[];
  allCategories?: string[];
}

const Filter: React.FC<FilterProps> = ({ onFilterChange, products, allCategories = [] }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const lastSent = useRef<string>("");
  const { productsMin, productsMax, uniqueSubcategories } = useMemo(() => {
    if (products.length === 0) {
      return { productsMin: 0, productsMax: 1000, uniqueSubcategories: [] };
    }
    const prices = products.map((p) => p.price);
    return {
      productsMin: Math.min(...prices),
      productsMax: Math.max(...prices),
      uniqueSubcategories: Array.from(new Set(products.map((p) => p.subcategory)))
    };
  }, [products]);

  // Sync minPrice/maxPrice with products list
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMinPrice(productsMin);
    setMaxPrice(productsMax);
    setSubcategories(uniqueSubcategories);

    // Reset price range to full if products change (e.g. initial load)
    setPriceRange([productsMin, productsMax]);
  }, [productsMin, productsMax, uniqueSubcategories]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      // Only notify when values actually changed — the parent passes a new
      // callback identity on every render, so an unconditional call would
      // ping-pong setState forever (infinite re-render loop).
      const snapshot = JSON.stringify({
        priceRange,
        subcategories: selectedSubcategories,
        categories: selectedCategories,
      });
      if (lastSent.current === snapshot) return;
      lastSent.current = snapshot;
      onFilterChange({
        priceRange,
        subcategories: selectedSubcategories,
        categories: selectedCategories
      });
    }, 300);
    return () => clearTimeout(debounceTimeout);
  }, [priceRange, selectedSubcategories, selectedCategories, onFilterChange]);

  const handlePriceChange = (newRange: number[]) => {
    setPriceRange(newRange);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    const newSelected = selectedSubcategories.includes(subcategory)
      ? selectedSubcategories.filter((s) => s !== subcategory)
      : [...selectedSubcategories, subcategory];
    setSelectedSubcategories(newSelected);
  };

  const handleCategoryChange = (category: string) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newSelected);
  };

  const handleClearFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedSubcategories([]);
    setSelectedCategories([]);
  };

  const isFilterActive =
    priceRange[0] !== minPrice ||
    priceRange[1] !== maxPrice ||
    selectedSubcategories.length > 0 ||
    selectedCategories.length > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="font-semibold mb-4 text-xl">Filters</p>

      {/* Categories Filter - Only render if allCategories provided */}
      {allCategories.length > 0 && (
        <div className="mb-6">
          <p className="font-semibold mb-2">Categories</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {allCategories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={`cat-${category}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`cat-${category}`} className="ml-2 text-gray-600">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="font-semibold mb-2">Price Range</p>

        <div className="px-2">
          <Range
            step={1}
            min={minPrice}
            max={maxPrice}
            values={priceRange}
            onChange={handlePriceChange}
            renderTrack={({ props, children }) => {
              return (
                <div
                  {...props}
                  className="w-full h-2 bg-gray-200 rounded-full"
                >
                  {children}
                </div>
              );
            }}
            renderThumb={({ props }) => {
              return (
                <div
                  {...props}
                  className="w-5 h-5 bg-blue-500 rounded-full"
                />
              );
            }}
          />
          <div className="flex justify-between mt-2">
            <span>Ksh.{priceRange[0]}</span>
            <span>Ksh.{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="font-semibold mb-2">Subcategory</p>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {subcategories.map((subcategory) => (
            <div key={subcategory} className="flex items-center">
              <input
                type="checkbox"
                id={subcategory}
                checked={selectedSubcategories.includes(subcategory)}
                onChange={() => handleSubcategoryChange(subcategory)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />

              <label htmlFor={subcategory} className="ml-2 text-gray-600">
                {subcategory}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleClearFilters}
          disabled={!isFilterActive}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;
