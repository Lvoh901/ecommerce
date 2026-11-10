import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PageHeader } from "../components";
import MessageManager from "./MessageManager";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const session = await requireRole("STAFF");
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div>
      <PageHeader title="Inbox" subtitle={`${messages.length} ${messages.length === 1 ? "message" : "messages"} from potential clients.`} />
      <MessageManager initialMessages={messages} isAdmin={session.role === "ADMIN"} />
    </div>
  );
}
