"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order, OrderStatus } from "@prisma/client";
import { StatusBadge, EmptyState } from "../components";
import { notify } from "@/lib/notify";

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function OrderManager({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  async function setStatus(order: Order, status: OrderStatus) {
    const res = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      notify.error("Status update failed", "The order status was not changed.");
      return;
    }
    const data = await res.json();
    setOrders((prev) => prev.map((o) => (o.id === order.id ? data.order : o)));
    notify.toast(`Order #${order.id} → ${status.replace("_", " ")}`);
    router.refresh();
  }

  const visible = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  if (orders.length === 0) return <EmptyState message="No orders yet. New checkouts will appear here." />;

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {["ALL", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filter === s ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-200"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visible.map((o) => {
              const items = o.items as unknown as OrderItem[];
              return (
                <Fragment key={o.id}>
                  <tr
                    onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-bold text-gray-900">#{o.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{o.name}</p>
                      <p className="text-xs text-gray-500">{o.email}{o.phone ? ` · ${o.phone}` : ""}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold">Ksh.{o.total.toLocaleString()}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={o.status}
                        onChange={(e) => setStatus(o, e.target.value as OrderStatus)}
                        className="text-xs font-bold rounded-full px-2 py-1.5 border border-gray-200 bg-gray-50 outline-none cursor-pointer"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <StatusBadge status={o.status} />
                          {o.address && <span className="text-gray-600">📍 {o.address}</span>}
                        </div>
                        <ul className="mt-2 space-y-1">
                          {items.map((item, i) => (
                            <li key={i} className="text-sm text-gray-700">
                              {item.quantity} × {item.name} — Ksh.{(item.price * item.quantity).toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
