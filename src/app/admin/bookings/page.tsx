import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { PageHeader } from "../components";
import BookingManager from "./BookingManager";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  await requireRole("STAFF");
  const bookings = await prisma.serviceBooking.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return (
    <div>
      <PageHeader title="Service bookings" subtitle={`${bookings.length} repair/service requests.`} />
      <BookingManager initialBookings={bookings} />
    </div>
  );
}
