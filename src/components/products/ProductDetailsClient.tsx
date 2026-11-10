"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  Check,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  StarHalf,
  Truck,
  Wrench,
} from "lucide-react";
import type { Product } from "@prisma/client";

const Rating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-yellow-600 fill-current" />,
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <StarHalf key={i} className="w-4 h-4 text-yellow-600 fill-current" />,
      );
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

export default function ProductDetailsClient({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

  const rating = Number.isFinite(product.rating) ? product.rating : 0;
  const reviews = product.reviews ?? 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  const trust = [
    {
      icon: Truck,
      label: "Free Nairobi delivery",
      note: "Same-day within CBD",
    },
    {
      icon: ShieldCheck,
      label: "Verified quality",
      note: "Checked before dispatch",
    },
    { icon: Wrench, label: "Repair support", note: "Expert in-store service" },
  ];

  return (
    <div className="relative min-h-screen bg-white pt-8 sm:pt-10 pb-14 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 tech-grid opacity-50 pointer-events-none" />
      <div className="absolute -top-24 right-0 w-[30rem] h-[22rem] bg-[#FF4500]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -left-24 w-72 h-72 bg-[#FF4500]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative container mx-auto px-4">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 overflow-x-auto whitespace-nowrap pb-1"
        >
          <Link href="/" className="hover:text-brand transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-400" />
          <Link href="/shop" className="hover:text-brand transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-400" />
          <Link href="/shop" className="hover:text-brand transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-400" />
          <div className="text-gray-900 truncate">{product.name}</div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mt-6">
          {/* Gallery */}
          <div className="lg:sticky lg:top-28 self-start">
            <div className="group relative aspect-square w-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-50 border border-gray-200 shadow-[0_28px_70px_-28px_rgba(2,6,23,0.35)]">
              <div className="absolute inset-0 tech-grid opacity-40 pointer-events-none" />
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <div className="bg-[#FF4500] text-white text-[11px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-[0_8px_20px_-8px_rgba(255,69,0,0.9)]">
                  {product.category}
                </div>
                <div className="glass-dark text-white text-[11px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
                  {product.subcategory}
                </div>
              </div>
              <div className="absolute bottom-4 right-4 glass rounded-full pl-2 pr-3 py-1.5 flex items-center gap-1.5 border border-white/50 shadow-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <div className="font-extrabold text-gray-900">
                  {rating.toFixed(1)}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {trust.map(({ icon: Icon, label, note }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white/80 backdrop-blur px-3 py-2.5"
                >
                  <span className="flex w-8 h-8 shrink-0 items-center justify-center rounded-lg bg-[#FF4500]/10 text-brand">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[12px] font-bold text-gray-900 leading-tight">
                      {label}
                    </div>
                    <div className="text-[11px] text-gray-500 leading-tight mt-0.5">
                      {note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <div className="eyebrow">{product.subcategory}</div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Product #{product.id.toString().padStart(4, "0")}
              </div>
            </div>

            <h2 className="mt-4 leading-tight text-gray-900">{product.name}</h2>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <Rating rating={rating} />
                <div className="text-[13px] font-bold text-gray-900">
                  {rating.toFixed(1)}
                </div>
              </div>
              <div className="h-4 w-px bg-gray-200 hidden sm:block" />
              <div className="text-[13px] text-gray-600">
                Based on{" "}
                <span className="font-bold text-gray-900 italic">
                  {reviews.toLocaleString()}
                </span>{" "}
                customer reviews
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
                <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">
                  Available to order
                </div>
              </div>
            </div>

            {/* Price card */}
            <div className="mt-3 relative rounded-2xl border border-[#FF4500]/20 bg-gradient-to-r from-[#FF4500]/[0.07] via-[#FF4500]/[0.03] to-transparent p-5">
              <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                <div className="text-4xl font-extrabold text-[#FF4500] leading-none italic">
                  Ksh.{product.price.toLocaleString()}
                </div>
                <div className="text-[13px] font-bold text-gray-500 pb-0.5">
                  VAT inclusive
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-gray-600">
                <div className="flex items-center gap-1.5 font-bold">
                  <Truck className="w-3.5 h-3.5 text-brand" />
                  Free delivery within Nairobi
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                  Genuine gadget, verified in-store
                </div>
              </div>
            </div>

            <div className="mt-3 text-[15px] leading-relaxed text-gray-600">
              {product.description}
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                "Quality-checked before dispatch",
                "Expert repair support available",
                "Free delivery across Nairobi",
                "Secure checkout & order tracking",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 flex w-5 h-5 shrink-0 items-center justify-center rounded-full bg-[#FF4500]/10 text-brand">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  <div className="text-[13px] font-medium text-gray-700">
                    {item}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_18px_40px_-30px_rgba(2,6,23,0.5)]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center justify-between sm:justify-start rounded-xl border border-gray-300 bg-gray-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-11 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div
                    aria-live="polite"
                    className="w-12 text-center text-base font-extrabold text-gray-900"
                  >
                    {quantity}
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    aria-label="Increase quantity"
                    className="w-11 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 rounded-xl px-6 h-12 text-white font-bold uppercase tracking-wide text-sm"
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" strokeWidth={3} />
                      Added to cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to cart
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="mt-3 w-full h-12 rounded-xl border border-gray-900 text-gray-900 font-bold uppercase tracking-wide text-sm hover:bg-gray-900 hover:text-white transition-colors"
              >
                Buy it now
              </button>

              <div className="mt-3 text-center text-md">
                Total for {quantity} item{quantity > 1 ? "s" : ""}:{" "}
                <span className="font-extrabold">
                  Ksh.{(product.price * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Details grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: "Category", value: product.category },
                { label: "Type", value: product.subcategory },
                { label: "Rating", value: `${rating.toFixed(1)} / 5` },
                { label: "Reviews", value: reviews.toLocaleString() },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-gray-200 hover:border-neon bg-gray-50/80 px-3 py-2.5 text-center flex flex-col cursor-pointer"
                >
                  <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-gray-500">
                    {label}
                  </span>
                  <span className="text-sm font-bold text-gray-900 truncate uppercase">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
