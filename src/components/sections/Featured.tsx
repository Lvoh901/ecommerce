import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function Featured() {
    const [categories, products] = await Promise.all([
        prisma.category.findMany({ orderBy: { name: "asc" } }),
        prisma.product.findMany({ select: { category: true } }),
    ]);

    const productCategories = Array.from(new Set(products.map((p) => p.category)));

    // Marketing categories don't always match a product category name exactly,
    // so resolve the closest real category for a working filter link.
    const linkFor = (name: string, fallback: string) => {
        const lower = name.toLowerCase();
        const match =
            productCategories.find((c) => c.toLowerCase() === lower) ||
            productCategories.find((c) => lower.includes(c.toLowerCase()));
        return match ? `/shop?category=${encodeURIComponent(match)}` : fallback;
    };

    return (
        <section className="relative overflow-hidden bg-gray-50 py-12 sm:py-16 lg:py-20">
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-70" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-[#FF4500]/10 blur-[100px]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <span className="eyebrow mb-3">Curated lineup</span>
                        <h2 className="font-extrabold text-gray-900">
                            Shop by <span className="text-brand">category</span>
                        </h2>
                        <p className="mt-1 max-w-xl text-sm text-gray-600 sm:text-base">
                            Every category is stocked with gadgets we&apos;ve checked in-store before they ship.
                        </p>
                    </div>
                    <Link
                        href="/shop"
                        className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-gray-800 transition-colors hover:border-[#FF4500]/50 hover:text-[#FF4500]"
                    >
                        View all products
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {categories.slice(0, 8).map((category, idx) => (
                        <Link
                            href={linkFor(category.name, category.link)}
                            key={category.id}
                            className="group relative flex h-44 flex-col justify-end overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF4500]/50 hover:shadow-[0_24px_50px_-24px_rgba(255,69,0,0.45)] sm:h-56 lg:h-64"
                        >
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(min-width: 1024px) 300px, 45vw"
                                priority={idx < 4}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#05070f]/90 via-[#05070f]/40 to-transparent" />
                            <div className="absolute inset-x-0 top-0 hairline opacity-0 transition-opacity group-hover:opacity-100" />

                            <div className="relative z-10 p-3.5 sm:p-5">
                                <p className="font-['Orbitron'] text-sm font-bold leading-tight text-white sm:text-base">
                                    {category.name}
                                </p>
                                <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-gray-300 sm:text-xs">
                                    From <span className="text-[#FF4500]">Ksh.{category.fromPrice.toLocaleString()}</span>
                                </p>
                                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                                    Shop now <ArrowRight className="h-3 w-3" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
