import Link from "next/link";
import { Package, ShoppingCart, Wrench, Inbox, Users, ArrowRight, Mails } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { StatCard, StatusBadge, PageHeader } from "./components";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  await requireRole("STAFF");

  const [productCount, orderCount, bookingCount, newMessages, userCount, subscriberCount, revenue, recentOrders, recentMessages] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.serviceBooking.count(),
      prisma.message.count({ where: { status: "NEW" } }),
      prisma.user.count(),
      prisma.subscriber.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Store performance at a glance." />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <StatCard icon={ShoppingCart} label="Total orders" value={orderCount} hint={`Revenue Ksh.${(revenue._sum.total ?? 0).toLocaleString()}`} />
        <StatCard icon={Package} label="Products listed" value={productCount} />
        <StatCard icon={Wrench} label="Service bookings" value={bookingCount} />
        <StatCard icon={Inbox} label="New messages" value={newMessages} hint="Needs a reply" />
        <StatCard icon={Mails} label="Subscribers" value={subscriberCount} hint="Newsletter signups" />
        <StatCard icon={Users} label="Registered users" value={userCount} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-[#FF4500] hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentOrders.map((o) => (
                <li key={o.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">#{o.id} — {o.name}</p>
                    <p className="text-xs text-gray-500">Ksh.{o.total.toLocaleString()}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Latest messages</h2>
            <Link href="/admin/messages" className="text-sm font-semibold text-[#FF4500] hover:underline flex items-center gap-1">
              Open inbox <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-gray-500">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentMessages.map((m) => (
                <li key={m.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                    <p className="text-xs text-gray-500 truncate">{m.message}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
