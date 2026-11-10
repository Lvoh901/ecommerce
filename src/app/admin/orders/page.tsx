import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PageHeader } from "../components";
import OrderManager from "./OrderManager";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireRole("STAFF");
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div>
      <PageHeader title="Orders" subtitle={orders.length === 0 ? "No customer orders yet." : `${orders.length} customer ${orders.length === 1 ? "order" : "orders"} · click a row to see items.`} />
      <OrderManager initialOrders={orders} />
    </div>
  );
}
