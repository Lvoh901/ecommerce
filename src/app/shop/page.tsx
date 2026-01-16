import { prisma } from "@/lib/db";
import ShopClient from "@/components/shop/ShopClient";

export const dynamic = 'force-dynamic'; // Ensure we get fresh data if DB changes

export default async function ShopPage() {
  const products = await prisma.product.findMany();
  
  // Extract unique categories
  const categories = Array.from(new Set(products.map((p: { category: string }) => p.category))) as string[];

  return <ShopClient products={products} allCategories={categories} />;
}
