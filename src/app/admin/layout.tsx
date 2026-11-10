import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminNav from "./AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("STAFF");
  const isAdmin = session.role === "ADMIN";

  const [pendingOrders, newMessages, requestedBookings, productCount, categoryCount, subscriberCount, userCount] =
    await Promise.all([
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.message.count({ where: { status: "NEW" } }),
      prisma.serviceBooking.count({ where: { status: "REQUESTED" } }),
      prisma.product.count(),
      prisma.category.count(),
      prisma.subscriber.count(),
      prisma.user.count(),
    ]);

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <AdminNav
        isAdmin={isAdmin}
        counts={{
          orders: pendingOrders,
          messages: newMessages,
          bookings: requestedBookings,
          products: productCount,
          categories: categoryCount,
          subscribers: subscriberCount,
          users: userCount,
        }}
        user={{ name: session.name, email: session.email, role: session.role }}
      />
      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
