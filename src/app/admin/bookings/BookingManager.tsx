"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Mail, Phone, Smartphone } from "lucide-react";
import type { ServiceBooking, BookingStatus } from "@prisma/client";
import { StatusBadge, EmptyState, formatDay, formatDateTime } from "../components";
import { FilterChips, SearchField } from "../ui";
import { notify } from "@/lib/notify";

const STATUSES: BookingStatus[] = ["REQUESTED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const FILTERS = [
  { value: "ALL", label: "All" },
  ...STATUSES.map((status) => ({
    value: status,
    label: status.charAt(0) + status.slice(1).toLowerCase().replace("_", " "),
  })),
];

export default function BookingManager({ initialBookings }: { initialBookings: ServiceBooking[] }) {
  const router = useRouter();
  const [bookings, setBookings] = useState<ServiceBooking[]>(initialBookings);
  const [filter, setFilter] = useState<string>("ALL");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: bookings.length };
    bookings.forEach((booking) => {
      map[booking.status] = (map[booking.status] ?? 0) + 1;
    });
    return map;
  }, [bookings]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesStatus = filter === "ALL" || booking.status === filter;
      if (!matchesStatus) return false;
      if (!needle) return true;
      return [booking.name, booking.email, booking.phone, booking.device, booking.issue]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [bookings, filter, query]);

  async function setStatus(booking: ServiceBooking, status: BookingStatus) {
    if (status === booking.status) return;
    const previous = bookings;
    setBookings((prev) => prev.map((item) => (item.id === booking.id ? { ...item, status } : item)));
    const res = await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setBookings(previous);
      notify.error("Status update failed", "The booking status was not changed.");
      return;
    }
    const data = await res.json();
    setBookings((prev) => prev.map((item) => (item.id === booking.id ? data.booking : item)));
    notify.toast(`Booking #${booking.id} → ${status.toLowerCase().replace("_", " ")}`);
    router.refresh();
  }

  if (bookings.length === 0) {
    return <EmptyState title="No bookings yet" message="Repair requests from the storefront will appear here." />;
  }

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search customer, device or issue…"
        />
        <FilterChips label="Filter by status" value={filter} onChange={setFilter} options={FILTERS} counts={counts} />
      </div>

      <p className="mt-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {visible.length} of {bookings.length} bookings
      </p>

      {visible.length === 0 ? (
        <EmptyState title="No bookings match" message="Try a different search term or status filter." />
      ) : (
        <ul className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {visible.map((booking) => (
            <li
              key={booking.id}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:border-gray-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                    <span className="text-gray-400">#{booking.id}</span>
                    {booking.device}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {booking.name} · {booking.email}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <p className="mt-2.5 rounded-xl bg-gray-50 px-3 py-2 text-sm leading-relaxed text-gray-700">
                {booking.issue}
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {formatDay(booking.createdAt)}
                </span>
                {booking.preferredAt && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">
                    Preferred {formatDateTime(booking.preferredAt)}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3">
                <a
                  href={`tel:${booking.phone}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Phone className="h-3.5 w-3.5" /> {booking.phone}
                </a>
                <a
                  href={`mailto:${booking.email}?subject=${encodeURIComponent(
                    `Your KonnectTech service booking #${booking.id}`
                  )}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Mail className="h-3.5 w-3.5" /> Email
                </a>
                <span className="ml-auto inline-flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-gray-400" />
                  <select
                    value={booking.status}
                    onChange={(event) => setStatus(booking, event.target.value as BookingStatus)}
                    aria-label={`Status for booking ${booking.id}`}
                    className="cursor-pointer rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold text-gray-800 outline-none focus:border-[#FF4500]"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
