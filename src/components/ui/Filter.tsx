'use client';

import { useState, useEffect } from 'react';
import { Range } from 'react-range';
import { Product } from '@prisma/client';

interface FilterProps {
  onFilterChange: (filters: { priceRange: number[]; subcategories: string[]; categories?: string[] }) => void;
  products: Product[];
  allCategories?: string[];
}

const Filter: React.FC<FilterProps> = ({ onFilterChange, products, allCategories = [] }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);

      // Only update state if values actually need to change
      setMinPrice(prev => prev !== min ? min : prev);
      setMaxPrice(prev => prev !== max ? max : prev);

      // Reset price range if products changed significantly (optional, maybe keep user selection if valid)
      // For now, let's only expand range if needed, but not shrink if user selected subset (complex logic).
      // Simpler: Just sync range boundaries to min/max if current selection is out of bounds or on init.
      setPriceRange(prev => [
          Math.max(min, prev[0]),
          Math.min(max, prev[1])
      ]);
      // Actually, better to reset to full range if product set changes completely (like jumping categories),
      // but here we are in Shop page, so product set is ALL.
      // If we filter, products prop might filter down? No, ShopClient passes ALL products to Filter usually?
      // Ah, ShopClient filters products based on its own state. Filter component receives... what?
      // In ShopClient: <Filter ... products={products} /> where products is the initial FULL list.
      // So products prop never changes in ShopClient unless DB updates.
      // So this effect runs once.
      setPriceRange([min, max]);

      const uniqueSubcategories = Array.from(
        new Set(products.map((p) => p.subcategory))
      );
      setSubcategories(uniqueSubcategories);
    }
  }, [products]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
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
              const { key, ...restProps } = props as any;
              return (
                <div
                  key={key}
                  {...restProps}
                  className="w-full h-2 bg-gray-200 rounded-full"
                >
                  {children}
                </div>
              );
            }}
            renderThumb={({ props }) => {
              const { key, ...restProps } = props as any;
              return (
                <div
                  key={key}
                  {...restProps}
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
