"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Download } from "lucide-react";
import type { Subscriber } from "@prisma/client";
import { EmptyState } from "../components";
import { notify } from "@/lib/notify";

export default function SubscriberManager({
  initialSubscribers,
  isAdmin,
}: {
  initialSubscribers: Subscriber[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);

  async function handleDelete(id: number) {
    const ok = await notify.confirmDelete("Remove subscriber?", "They will stop receiving the newsletter.");
    if (!ok) return;
    const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
    if (!res.ok) {
      notify.error("Delete failed", "The subscriber could not be removed.");
      return;
    }
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    notify.toast("Subscriber removed");
    router.refresh();
  }

  function exportCsv() {
    const rows = ["email,subscribed_at", ...subscribers.map((s) => `${s.email},${new Date(s.createdAt).toISOString()}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "konnecttech-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (subscribers.length === 0) {
    return <EmptyState message="No subscribers yet. Homepage CTA signups will appear here." />;
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Subscribed</th>
              {isAdmin && <th className="px-4 py-3 font-semibold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subscribers.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{s.email}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(s.createdAt).toLocaleString()}
                </td>
                {isAdmin && (
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                        aria-label={`Remove ${s.email}`}
                        title="Remove subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
