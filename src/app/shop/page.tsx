import { prisma } from "@/lib/db";
import ShopClient from "@/components/shop/ShopClient";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await prisma.product.findMany();
  
  // Extract unique categories
  const categories = Array.from(new Set(products.map((p: { category: string }) => p.category))) as string[];

  return (
    <>
      <Navigation />
      <ShopClient products={products} allCategories={categories} />
      <Footer />
    </>
  );
}
