import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PageHeader } from "../components";
import CategoryManager from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireRole("STAFF");
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <PageHeader title="Categories" subtitle={`${categories.length} categories on the store.`} />
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
