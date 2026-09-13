import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PageHeader } from "../components";
import SubscriberManager from "./SubscriberManager";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const session = await requireRole("STAFF");
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  return (
    <div>
      <PageHeader
        title="Subscribers"
        subtitle={`${subscribers.length} newsletter signups from the homepage CTA.`}
      />
      <SubscriberManager initialSubscribers={subscribers} isAdmin={session.role === "ADMIN"} />
    </div>
  );
}
