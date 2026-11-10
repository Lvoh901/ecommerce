import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Wrench,
  Inbox,
  Users,
  ArrowRight,
  Mails,
  Wallet,
  Plus,
  Store,
  CircleAlert,
  CheckCircle2,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { StatCard, StatusBadge, PageHeader, Panel, money, formatDay } from "./components";
import OverviewChart, { type DayBucket } from "./OverviewChart";

export const dynamic = "force-dynamic";

const DAYS = 14;

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export default async function AdminOverview() {
  const session = await requireRole("STAFF");
  const isAdmin = session.role === "ADMIN";

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (DAYS - 1));

  const [
    productCount,
    orderCount,
    bookingCount,
    newMessages,
    userCount,
    subscriberCount,
    revenue,
    pendingOrders,
    requestedBookings,
    recentOrders,
    recentMessages,
    windowOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.serviceBooking.count(),
    prisma.message.count({ where: { status: "NEW" } }),
    prisma.user.count(),
    prisma.subscriber.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.serviceBooking.count({ where: { status: "REQUESTED" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.order.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true, total: true, status: true },
    }),
  ]);

  const buckets = new Map<string, DayBucket>();
  for (let index = 0; index < DAYS; index += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    buckets.set(dateKey(day), {
      date: dateKey(day),
      label: `${day.getDate()}/${day.getMonth() + 1}`,
      orders: 0,
      revenue: 0,
    });
  }
  for (const order of windowOrders) {
    const bucket = buckets.get(dateKey(order.createdAt));
    if (!bucket) continue;
    bucket.orders += 1;
    if (order.status !== "CANCELLED") bucket.revenue += order.total;
  }

  const attention = [
    {
      label: "Orders awaiting confirmation",
      count: pendingOrders,
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      label: "Unread contact messages",
      count: newMessages,
      href: "/admin/messages",
      icon: Inbox,
    },
    {
      label: "Service requests to schedule",
      count: requestedBookings,
      href: "/admin/bookings",
      icon: Wrench,
    },
  ];
  const openItems = attention.reduce((sum, item) => sum + item.count, 0);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Store performance at a glance — pick a card to jump straight to the work."
        action={
          <>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              <Store className="h-4 w-4" /> View store
            </Link>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF4500] px-3.5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#e03d00]"
            >
              <Plus className="h-4 w-4" /> Add product
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="Revenue"
          value={money(revenue._sum.total ?? 0)}
          hint="All time · excludes cancelled"
          href="/admin/orders"
        />
        <StatCard
          icon={ShoppingCart}
          label="Orders"
          value={orderCount}
          hint={pendingOrders > 0 ? `${pendingOrders} pending` : "All caught up"}
          href="/admin/orders"
        />
        <StatCard icon={Package} label="Products listed" value={productCount} href="/admin/products" />
        <StatCard
          icon={Wrench}
          label="Service bookings"
          value={bookingCount}
          hint={requestedBookings > 0 ? `${requestedBookings} to schedule` : "No open requests"}
          href="/admin/bookings"
        />
        <StatCard
          icon={Inbox}
          label="New messages"
          value={newMessages}
          hint={newMessages > 0 ? "Needs a reply" : "Inbox clear"}
          href="/admin/messages"
        />
        <StatCard icon={Mails} label="Subscribers" value={subscriberCount} href="/admin/subscribers" />
        {isAdmin && <StatCard icon={Users} label="Registered users" value={userCount} href="/admin/users" />}
        <Link
          href="/admin/orders"
          className="group flex flex-col justify-between rounded-2xl border border-gray-900 bg-[#05070f] p-4 text-white transition-all hover:border-[#FF4500]/50 sm:p-5"
        >
          <div className="flex items-center justify-between">
            <CircleAlert className="h-5 w-5 text-[#FF6a2b]" />
            <ArrowRight className="h-4 w-4 text-gray-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
          </div>
          <div>
            <p className="text-2xl font-extrabold tabular-nums">{openItems}</p>
            <p className="mt-1 text-sm text-gray-400">Items need attention</p>
          </div>
        </Link>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Store activity" description="Orders and revenue over the last two weeks.">
          <OverviewChart days={[...buckets.values()]} />
        </Panel>

        <Panel
          title="Needs attention"
          description={openItems === 0 ? "Everything is handled." : `${openItems} open items in the queue.`}
        >
          <ul className="divide-y divide-gray-100">
            {attention.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50 sm:px-5"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      item.count > 0 ? "bg-[#FF4500]/10 text-[#FF4500]" : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {item.count > 0 ? (
                      <item.icon className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-gray-900">{item.label}</span>
                    <span className="block text-xs text-gray-500">
                      {item.count === 0 ? "Nothing waiting" : `${item.count} waiting`}
                    </span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-extrabold tabular-nums ${
                      item.count > 0 ? "bg-[#FF4500] text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel
          title="Recent orders"
          action={
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF4500] hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          {recentOrders.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500 sm:px-5">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <li key={order.id}>
                  <Link
                    href="/admin/orders"
                    className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-gray-50 sm:px-5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        #{order.id} · {order.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {money(order.total)} · {formatDay(order.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Latest messages"
          action={
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF4500] hover:underline"
            >
              Open inbox <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          {recentMessages.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500 sm:px-5">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentMessages.map((message) => (
                <li key={message.id}>
                  <Link
                    href="/admin/messages"
                    className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-gray-50 sm:px-5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{message.name}</p>
                      <p className="truncate text-xs text-gray-500">{message.message}</p>
                    </div>
                    <StatusBadge status={message.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
