"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Download, Copy, Check } from "lucide-react";
import type { Subscriber } from "@prisma/client";
import { EmptyState, formatDate } from "../components";
import { SearchField } from "../ui";
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
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return subscribers;
    return subscribers.filter((subscriber) => subscriber.email.toLowerCase().includes(needle));
  }, [subscribers, query]);

  async function handleDelete(id: number) {
    const ok = await notify.confirmDelete("Remove subscriber?", "They will stop receiving the newsletter.");
    if (!ok) return;
    const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
    if (!res.ok) {
      notify.error("Delete failed", "The subscriber could not be removed.");
      return;
    }
    setSubscribers((prev) => prev.filter((subscriber) => subscriber.id !== id));
    notify.toast("Subscriber removed");
    router.refresh();
  }

  function exportCsv() {
    const rows = [
      "email,subscribed_at",
      ...visible.map((subscriber) => `${subscriber.email},${new Date(subscriber.createdAt).toISOString()}`),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "konnecttech-subscribers.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    notify.toast(`Exported ${visible.length} subscriber${visible.length === 1 ? "" : "s"}`);
  }

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(visible.map((subscriber) => subscriber.email).join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      notify.toast("Emails copied to clipboard");
    } catch {
      notify.error("Copy failed", "Your browser blocked clipboard access.");
    }
  }

  if (subscribers.length === 0) {
    return (
      <EmptyState title="No subscribers yet" message="Newsletter signups from the storefront will appear here." />
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:p-4">
        <SearchField value={query} onChange={setQuery} placeholder="Search by email…" className="flex-1" />
        <div className="flex items-center gap-2">
          <button
            onClick={copyAll}
            className="inline-flex h-[42px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy emails"}
          </button>
          <button
            onClick={exportCsv}
            className="inline-flex h-[42px] items-center gap-2 rounded-xl bg-gray-900 px-3.5 text-sm font-bold text-white transition-colors hover:bg-gray-800"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      <p className="mt-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {visible.length} of {subscribers.length} subscribers
      </p>

      {visible.length === 0 ? (
        <EmptyState title="No subscribers match" message="Try a different email search." />
      ) : (
        <>
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:hidden">
            {visible.map((subscriber) => (
              <li key={subscriber.id} className="flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{subscriber.email}</p>
                  <p className="text-[11px] text-gray-400">
                    {formatDate(subscriber.createdAt)}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(subscriber.id)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    aria-label={`Remove ${subscriber.email}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Subscribed</th>
                  {isAdmin && <th className="px-4 py-3 text-right font-semibold">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visible.map((subscriber) => (
                  <tr key={subscriber.id} className="transition-colors hover:bg-gray-50/70">
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${subscriber.email}`}
                        className="font-semibold text-gray-900 hover:text-[#FF4500] hover:underline"
                      >
                        {subscriber.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {formatDate(subscriber.createdAt)}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleDelete(subscriber.id)}
                            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                            aria-label={`Remove ${subscriber.email}`}
                            title="Remove subscriber"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
