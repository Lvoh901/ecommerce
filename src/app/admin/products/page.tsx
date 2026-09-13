import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PageHeader } from "../components";
import ProductManager from "./ProductManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireRole("STAFF");
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { id: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return (
    <div>
      <PageHeader title="Listings" subtitle={`${products.length} products live on the store.`} />
      <ProductManager initialProducts={products} categories={categories} />
    </div>
  );
}
