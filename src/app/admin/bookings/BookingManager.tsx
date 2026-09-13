"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ServiceBooking, BookingStatus } from "@prisma/client";
import { EmptyState } from "../components";
import { notify } from "@/lib/notify";

const STATUSES: BookingStatus[] = ["REQUESTED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function BookingManager({ initialBookings }: { initialBookings: ServiceBooking[] }) {
  const router = useRouter();
  const [bookings, setBookings] = useState<ServiceBooking[]>(initialBookings);
  const [filter, setFilter] = useState<string>("ALL");

  async function setStatus(booking: ServiceBooking, status: BookingStatus) {
    const res = await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      notify.error("Status update failed", "The booking status was not changed.");
      return;
    }
    const data = await res.json();
    setBookings((prev) => prev.map((b) => (b.id === booking.id ? data.booking : b)));
    notify.toast(`Booking #${booking.id} → ${status.replace("_", " ")}`);
    router.refresh();
  }

  const visible = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  if (bookings.length === 0) return <EmptyState message="No service bookings yet." />;

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {["ALL", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filter === s ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-200"}`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visible.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="font-bold text-gray-900">#{b.id} — {b.device}</p>
                <p className="text-sm text-gray-600">{b.name} · {b.phone}</p>
                <p className="text-xs text-gray-500">{b.email}</p>
              </div>
              <select
                value={b.status}
                onChange={(e) => setStatus(b, e.target.value as BookingStatus)}
                className="text-xs font-bold rounded-full px-2 py-1.5 border border-gray-200 bg-gray-50 outline-none cursor-pointer shrink-0"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2 mt-2">{b.issue}</p>
            <p className="text-xs text-gray-400 mt-2">
              Requested {new Date(b.createdAt).toLocaleString()}
              {b.preferredAt ? ` · Preferred ${new Date(b.preferredAt).toLocaleString()}` : ""}
            </p>
          </div>
        ))}
      </div>
      {visible.length === 0 && <EmptyState message={`No bookings with status ${filter}.`} />}
    </div>
  );
}
