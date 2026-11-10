import { prisma } from "@/lib/db";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import ProductDetailsClient from "@/components/products/ProductDetailsClient";
import ProductRail from "@/components/products/ProductRail";
import type { Product } from "@prisma/client";

const byRating = (a: Product, b: Product) => b.rating - a.rating || b.reviews - a.reviews;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);

  if (!Number.isFinite(productId)) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const others = await prisma.product.findMany({
    where: { id: { not: product.id } },
  });

  // Similar: same subcategory first, then same category, then the closest price point
  // so the rail stays useful even when a category only holds a single product.
  const prices = others.map((item) => item.price);
  const priceSpan = prices.length > 0 ? Math.max(...prices) - Math.min(...prices) : 0;

  const similarity = (item: Product) => {
    const categoryMatch =
      (item.subcategory === product.subcategory ? 3 : 0) +
      (item.category === product.category ? 2 : 0);
    const priceGap = priceSpan > 0 ? Math.abs(item.price - product.price) / priceSpan : 0;
    return categoryMatch - priceGap;
  };

  const similar = others
    .sort((a, b) => similarity(b) - similarity(a) || byRating(a, b))
    .slice(0, 4);

  const similarIds = new Set(similar.map((item) => item.id));

  // Recommendations: top rated products the shopper hasn't just been shown.
  const recommended = others
    .filter((item) => !similarIds.has(item.id))
    .sort(byRating)
    .slice(0, 6);

  return (
    <div>
      <Navigation />
      <ProductDetailsClient product={product} />

      <ProductRail
        eyebrow="Keep exploring"
        title="Similar Products"
        subtitle={`Picks that pair well with ${product.name.toLowerCase()} — comparable quality and pricing.`}
        products={similar}
        browseHref="/shop"
        browseLabel="Browse all products"
      />

      <ProductRail
        eyebrow="Handpicked for you"
        title="Recommended For You"
        subtitle="Top-rated gadgets other shoppers love — curated from across the store."
        products={recommended}
        layout="scroll"
        tone="dark"
        browseHref="/shop"
        browseLabel="View the shop"
      />

      <Footer />
    </div>
  );
}
