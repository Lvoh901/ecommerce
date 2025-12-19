'use client';

import { useState, useEffect } from 'react';
import { Range } from 'react-range';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  subcategory: string;
  rating: number;
  reviews: number;
}

interface FilterProps {
  onFilterChange: (filters: { priceRange: number[]; subcategories: string[] }) => void;
  products: Product[];
}

const Filter: React.FC<FilterProps> = ({ onFilterChange, products }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
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

      // Reset price range if products changed significantly, otherwise preserve selection
      setPriceRange([min, max]);

      const uniqueSubcategories = Array.from(
        new Set(products.map((p) => p.subcategory))
      );
      setSubcategories(uniqueSubcategories);
    }
  }, [products]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onFilterChange({ priceRange, subcategories: selectedSubcategories });
    }, 300);
    return () => clearTimeout(debounceTimeout);
  }, [priceRange, selectedSubcategories, onFilterChange]);

  const handlePriceChange = (newRange: number[]) => {
    setPriceRange(newRange);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    const newSelected = selectedSubcategories.includes(subcategory)
      ? selectedSubcategories.filter((s) => s !== subcategory)
      : [...selectedSubcategories, subcategory];
    setSelectedSubcategories(newSelected);
    // Don't call onFilterChange directly here; let debounced effect handle it!
  };

  const handleClearFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedSubcategories([]);
  };

  const isFilterActive =
    priceRange[0] !== minPrice ||
    priceRange[1] !== maxPrice ||
    selectedSubcategories.length > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="font-semibold mb-4">Filters</p>

      <div>
        <p className="font-semibold mb-2">Price Range</p>

        <div className="px-2">
          <Range
            step={1}
            min={minPrice}
            max={maxPrice}
            values={priceRange}
            onChange={handlePriceChange}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="w-full h-2 bg-gray-200 rounded-full"
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                className="w-5 h-5 bg-blue-500 rounded-full"
              />
            )}
          />
          <div className="flex justify-between mt-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <p className="font-semibold mb-2">Subcategory</p>

        <div className="space-y-2">
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
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;
