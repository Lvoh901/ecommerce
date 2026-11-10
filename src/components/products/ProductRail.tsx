"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@prisma/client";

interface ProductRailProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  products: Product[];
  /** "grid" for a static four-up listing, "scroll" for an arrow-controlled rail */
  layout?: "grid" | "scroll";
  /** Optional light/dark treatment for the whole band */
  tone?: "light" | "dark";
  browseHref?: string;
  browseLabel?: string;
}

export default function ProductRail({
  eyebrow,
  title,
  subtitle,
  products,
  layout = "grid",
  tone = "light",
  browseHref,
  browseLabel,
}: ProductRailProps) {
  const scroller = useRef<HTMLDivElement | null>(null);

  if (products.length === 0) return null;

  const isDark = tone === "dark";
  const isScroll = layout === "scroll";

  const scrollByPage = (direction: 1 | -1) => {
    const node = scroller.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section
      aria-labelledby={`rail-${eyebrow.replace(/\s+/g, "-").toLowerCase()}`}
      className={`relative py-14 sm:py-16 overflow-hidden border-t ${
        isDark ? "bg-[#0b1120] border-white/10" : "bg-gray-50 border-gray-100"
      }`}
    >
      {isDark ? (
        <>
          <div className="absolute inset-0 tech-grid-dark opacity-60 pointer-events-none" />
          <div className="absolute -top-24 left-1/3 w-[30rem] h-64 bg-[#FF4500]/15 blur-[120px] rounded-full pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 tech-grid opacity-60 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30rem] h-40 bg-[#FF4500]/10 blur-[100px] rounded-full pointer-events-none" />
        </>
      )}

      <div className="relative container mx-auto px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-7">
          <div className="max-w-2xl">
            <div className="eyebrow">{eyebrow}</div>
            <h2
              id={`rail-${eyebrow.replace(/\s+/g, "-").toLowerCase()}`}
              className={`mt-3 font-extrabold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {title}
            </h2>
            <div className={`mt-2 text-[14px] leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {subtitle}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isScroll && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollByPage(-1)}
                  aria-label="Scroll to previous products"
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                    isDark
                      ? "border-white/15 text-gray-300 hover:text-white hover:border-[#FF4500]/60 hover:bg-white/5"
                      : "border-gray-300 text-gray-600 hover:text-gray-900 hover:border-[#FF4500]/60 hover:bg-white"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByPage(1)}
                  aria-label="Scroll to next products"
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                    isDark
                      ? "border-white/15 text-gray-300 hover:text-white hover:border-[#FF4500]/60 hover:bg-white/5"
                      : "border-gray-300 text-gray-600 hover:text-gray-900 hover:border-[#FF4500]/60 hover:bg-white"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {browseHref && browseLabel && (
              <Link
                href={browseHref}
                className={`inline-flex items-center gap-1.5 text-[13px] font-bold transition-colors ${
                  isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-[#FF4500]"
                }`}
              >
                {browseLabel}
                <ArrowRight className="w-4 h-4 text-[#FF4500]" />
              </Link>
            )}
          </div>
        </div>

        {isScroll ? (
          <div
            ref={scroller}
            className="-mx-4 px-4 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product) => (
              <div key={product.id} className="w-[260px] sm:w-[280px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
