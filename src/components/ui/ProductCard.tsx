"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@prisma/client";

interface ProductCardProps {
  product: Product;
}

const Rating = ({ rating }: { rating: number }) => {
  const rounded = Math.round(rating || 0);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= rounded ? "text-[#FFB020] fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_10px_30px_-24px_rgba(2,6,23,0.65)]">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-gray-100"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-[#05070f]/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white backdrop-blur">
          {product.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <Link href={`/products/${product.id}`} className="focus:outline-none">
          <h4 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#FF4500] sm:text-[15px]">
            {product.name}
          </h4>
        </Link>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Rating rating={product.rating || 0} />
          <span className="text-[11px] font-semibold text-gray-500">
            {(product.rating || 0).toFixed(1)} · {product.reviews} reviews
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <p className="text-base font-extrabold tracking-tight text-[#FF4500] sm:text-lg">
            Ksh.{product.price.toLocaleString()}
          </p>
          <span className="hidden text-[11px] font-medium text-gray-400 sm:block">
            {product.subcategory}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 rounded-lg border border-gray-200 bg-gray-50 py-2 text-center text-[11px] font-extrabold uppercase tracking-wider text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-100"
          >
            Details
          </Link>

          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-extrabold uppercase tracking-wider text-white ${
              added ? "bg-green-600" : "btn-primary"
            }`}
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
