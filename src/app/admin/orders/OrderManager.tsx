"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order, OrderStatus } from "@prisma/client";
import { ChevronDown, Mail, MapPin, Phone, ReceiptText } from "lucide-react";
import { StatusBadge, EmptyState, money, formatDate } from "../components";
import { FilterChips, SearchField } from "../ui";
import { notify } from "@/lib/notify";

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const FILTERS = [
  { value: "ALL", label: "All" },
  ...STATUSES.map((status) => ({ value: status, label: status.charAt(0) + status.slice(1).toLowerCase() })),
];

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

function itemsOf(order: Order): OrderItem[] {
  return Array.isArray(order.items) ? (order.items as unknown as OrderItem[]) : [];
}

export default function OrderManager({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: orders.length };
    orders.forEach((order) => {
      map[order.status] = (map[order.status] ?? 0) + 1;
    });
    return map;
  }, [orders]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = filter === "ALL" || order.status === filter;
      if (!matchesStatus) return false;
      if (!needle) return true;
      return [`#${order.id}`, order.name, order.email, order.phone ?? "", order.address ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [orders, filter, query]);

  async function setStatus(order: Order, status: OrderStatus) {
    if (status === order.status) return;
    const optimistic = orders.map((item) => (item.id === order.id ? { ...item, status } : item));
    setOrders(optimistic);
    const res = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setOrders(orders);
      notify.error("Status update failed", "The order status was not changed.");
      return;
    }
    const data = await res.json();
    setOrders((prev) => prev.map((item) => (item.id === order.id ? data.order : item)));
    notify.toast(`Order #${order.id} → ${status.toLowerCase()}`);
    router.refresh();
  }

  if (orders.length === 0) return <EmptyState message="New checkouts will appear here." />;

  const details = (order: Order) => {
    const items = itemsOf(order);
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {order.phone && (
            <a
              href={`tel:${order.phone}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Phone className="h-3.5 w-3.5" /> {order.phone}
            </a>
          )}
          <a
            href={`mailto:${order.email}?subject=${encodeURIComponent(`Your KonnectTech order #${order.id}`)}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Mail className="h-3.5 w-3.5" /> Email customer
          </a>
          {order.address && (
            <span className="inline-flex items-start gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600">
              <MapPin className="mt-px h-3.5 w-3.5 shrink-0" /> {order.address}
            </span>
          )}
        </div>
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-100 bg-white">
          {items.length === 0 && (
            <li className="px-3 py-2.5 text-xs text-gray-500">No line items recorded.</li>
          )}
          {items.map((item, index) => (
            <li key={`${item.id}-${index}`} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <span className="min-w-0 text-sm text-gray-700">
                <span className="font-bold text-gray-900">{item.quantity}×</span> {item.name}
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-gray-900">
                {money(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search by order #, customer, phone or address…"
        />
        <FilterChips label="Filter by status" value={filter} onChange={setFilter} options={FILTERS} counts={counts} />
      </div>

      <p className="mt-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {visible.length} of {orders.length} orders ·{" "}
        {money(visible.filter((order) => order.status !== "CANCELLED").reduce((sum, order) => sum + order.total, 0))}{" "}
        shown
      </p>

      {visible.length === 0 ? (
        <EmptyState
          title="No orders match"
          message="Adjust the search or status filter to see more orders."
          action={
            <button
              onClick={() => {
                setQuery("");
                setFilter("ALL");
              }}
              className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Reset filters
            </button>
          }
        />
      ) : (
        <>
          {/* Mobile cards */}
          <ul className="space-y-2 lg:hidden">
            {visible.map((order) => {
              const open = expanded === order.id;
              return (
                <li key={order.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <button
                    onClick={() => setExpanded(open ? null : order.id)}
                    aria-expanded={open}
                    className="flex w-full items-start gap-3 p-3 text-left"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF4500]/10 text-xs font-extrabold text-[#FF4500]">
                      #{order.id}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-gray-900">{order.name}</span>
                      <span className="block truncate text-xs text-gray-500">{order.email}</span>
                      <span className="mt-1 block text-sm font-semibold text-gray-900">{money(order.total)}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1.5">
                      <StatusBadge status={order.status} />
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </span>
                  </button>
                  {open && (
                    <div className="space-y-3 border-t border-gray-100 bg-gray-50/60 p-3">
                      <label className="flex items-center justify-between gap-2 text-xs font-semibold text-gray-600">
                        Status
                        <select
                          value={order.status}
                          onChange={(event) => setStatus(order, event.target.value as OrderStatus)}
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold text-gray-800 outline-none focus:border-[#FF4500]"
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0) + status.slice(1).toLowerCase()}
                            </option>
                          ))}
                        </select>
                      </label>
                      {details(order)}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Placed</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visible.map((order) => {
                  const open = expanded === order.id;
                  return (
                    <tr key={order.id} className="group align-top">
                      <td colSpan={6} className="p-0">
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setExpanded(open ? null : order.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setExpanded(open ? null : order.id);
                            }
                          }}
                          className={`grid cursor-pointer grid-cols-[80px_1.6fr_1fr_150px_1fr_40px] items-center px-4 py-3 transition-colors ${
                            open ? "bg-gray-50" : "hover:bg-gray-50/70"
                          }`}
                        >
                          <span className="font-bold text-gray-900">#{order.id}</span>
                          <span className="min-w-0 pr-3">
                            <span className="block truncate font-semibold text-gray-900">{order.name}</span>
                            <span className="block truncate text-xs text-gray-500">{order.email}</span>
                          </span>
                          <span className="font-semibold tabular-nums text-gray-900">{money(order.total)}</span>
                          <span onClick={(event) => event.stopPropagation()}>
                            <select
                              value={order.status}
                              onChange={(event) => setStatus(order, event.target.value as OrderStatus)}
                              aria-label={`Status for order ${order.id}`}
                              className="cursor-pointer rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold text-gray-800 outline-none focus:border-[#FF4500]"
                            >
                              {STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {status.charAt(0) + status.slice(1).toLowerCase()}
                                </option>
                              ))}
                            </select>
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-gray-400 transition-transform ${
                              open ? "rotate-180 text-[#FF4500]" : "group-hover:text-gray-600"
                            }`}
                          />
                        </div>
                        {open && (
                          <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-3">
                            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                              <ReceiptText className="h-3.5 w-3.5" /> Order #{order.id} details
                            </div>
                            {details(order)}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
