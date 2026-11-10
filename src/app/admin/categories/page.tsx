import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PageHeader } from "../components";
import CategoryManager from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireRole("STAFF");
  const [categories, grouped] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.groupBy({ by: ["category"], _count: { _all: true } }),
  ]);
  const productCounts = Object.fromEntries(grouped.map((row) => [row.category, row._count._all]));

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle={`${categories.length} categories, used by the storefront tiles and shop filters.`}
      />
      <CategoryManager initialCategories={categories} productCounts={productCounts} />
    </div>
  );
}
