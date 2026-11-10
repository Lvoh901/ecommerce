"use client";

import { Range } from "react-range";
import { SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@prisma/client";

export interface ShopFilters {
  priceRange: [number, number];
  subcategories: string[];
  categories: string[];
}

interface FilterProps {
  products: Product[];
  allCategories: string[];
  filters: ShopFilters;
  onPriceChange: (range: [number, number]) => void;
  onToggleCategory: (category: string) => void;
  onToggleSubcategory: (subcategory: string) => void;
  onClear: () => void;
}

const Filter: React.FC<FilterProps> = ({
  products,
  allCategories,
  filters,
  onPriceChange,
  onToggleCategory,
  onToggleSubcategory,
  onClear,
}) => {
  const prices = products.map((p) => p.price);
  const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000;

  const subcategories = Array.from(new Set(products.map((p) => p.subcategory))).sort();
  const countByCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const isActive =
    filters.priceRange[0] !== minPrice ||
    filters.priceRange[1] !== maxPrice ||
    filters.subcategories.length > 0 ||
    filters.categories.length > 0;

  const checkbox = (
    id: string,
    label: string,
    checked: boolean,
    onChange: () => void,
    count?: number,
  ) => (
    <label
      key={id}
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors ${
        checked ? "bg-[#FF4500]/8 text-gray-900" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-[#FF4500]"
      />
      <span className="flex-1 truncate text-[13px] font-medium">{label}</span>
      {typeof count === "number" && (
        <span className="text-[11px] font-semibold text-gray-400">{count}</span>
      )}
    </label>
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_16px_40px_-32px_rgba(2,6,23,0.6)] sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-gray-900">
          <SlidersHorizontal className="h-4 w-4 text-[#FF4500]" />
          Filters
        </p>
        {isActive && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-600 transition-colors hover:bg-gray-200"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-gray-500">
            Price range
          </p>
          <div className="px-2 pt-3">
            <Range
              step={1}
              min={minPrice}
              max={maxPrice}
              values={filters.priceRange}
              onChange={(values) => onPriceChange([values[0], values[1]])}
              renderTrack={({ props, children }) => (
                <div {...props} className="h-1.5 w-full rounded-full bg-gray-200">
                  {children}
                </div>
              )}
              renderThumb={({ props }) => {
                // react-range passes the thumb key inside props; React 19 requires
                // it to be passed directly, so split it out before spreading.
                const { key, ...rest } = props;
                return (
                  <div
                    key={key}
                    {...rest}
                    className="h-4 w-4 rounded-full border-2 border-white bg-[#FF4500] shadow-[0_0_0_1px_rgba(255,69,0,0.4)] focus:outline-none"
                  />
                );
              }}
            />
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-gray-600">
              <span>Ksh.{filters.priceRange[0].toLocaleString()}</span>
              <span>Ksh.{filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {allCategories.length > 0 && (
          <div>
            <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-gray-500">
              Categories
            </p>
            <div className="max-h-52 space-y-0.5 overflow-y-auto pr-1">
              {allCategories.map((category) =>
                checkbox(
                  `cat-${category}`,
                  category,
                  filters.categories.includes(category),
                  () => onToggleCategory(category),
                  countByCategory[category],
                ),
              )}
            </div>
          </div>
        )}

        <div>
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-gray-500">
            Type
          </p>
          <div className="max-h-52 space-y-0.5 overflow-y-auto pr-1">
            {subcategories.map((subcategory) =>
              checkbox(
                `sub-${subcategory}`,
                subcategory,
                filters.subcategories.includes(subcategory),
                () => onToggleSubcategory(subcategory),
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
