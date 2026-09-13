import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PageHeader } from "../components";
import UserManager from "./UserManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await requireRole("ADMIN");
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
  });
  return (
    <div>
      <PageHeader title="Users & access" subtitle="Control who can access the system and what they can do." />
      <UserManager initialUsers={users} currentUserId={session.sub} />
    </div>
  );
}
