"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  name: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/login?next=/orders";
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to load orders.");
          return;
        }
        setOrders(data.orders);
      })
      .catch(() => setError("Network error."));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-4">{error}</p>}
      {orders === null && !error && <p className="text-gray-500">Loading…</p>}
      {orders !== null && orders.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="inline-block bg-[#FF4500] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-orange-700">
            Start shopping
          </Link>
        </div>
      )}
      <div className="space-y-3">
        {orders?.map((o) => (
          <div key={o.id} className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-gray-900">Order #{o.id}</p>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">{o.status}</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              {o.items.map((item, i) => (
                <li key={i}>{item.quantity} × {item.name} — Ksh.{(item.price * item.quantity).toLocaleString()}</li>
              ))}
            </ul>
            <p className="text-sm font-bold mt-2">Total: Ksh.{o.total.toLocaleString()} <span className="font-normal text-gray-400">· {new Date(o.createdAt).toLocaleString()}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
