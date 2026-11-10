"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MailOpen, Reply, Trash2, Mail } from "lucide-react";
import type { Message, MessageStatus } from "@prisma/client";
import { StatusBadge, EmptyState, formatDateTime } from "../components";
import { FilterChips, SearchField } from "../ui";
import { notify } from "@/lib/notify";

const FILTERS = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: "Unread" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Replied" },
];

export default function MessageManager({
  initialMessages,
  isAdmin,
}: {
  initialMessages: Message[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [filter, setFilter] = useState<string>("ALL");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: messages.length };
    messages.forEach((message) => {
      map[message.status] = (map[message.status] ?? 0) + 1;
    });
    return map;
  }, [messages]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return messages.filter((message) => {
      const matchesStatus = filter === "ALL" || message.status === filter;
      if (!matchesStatus) return false;
      if (!needle) return true;
      return `${message.name} ${message.email} ${message.message}`.toLowerCase().includes(needle);
    });
  }, [messages, filter, query]);

  async function setStatus(message: Message, status: MessageStatus) {
    if (status === message.status) return;
    const res = await fetch(`/api/messages/${message.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      notify.error("Update failed", "The message status was not changed.");
      return;
    }
    const data = await res.json();
    setMessages((prev) => prev.map((item) => (item.id === message.id ? data.message : item)));
    notify.toast(`Marked ${status.toLowerCase()}`);
    router.refresh();
  }

  async function handleDelete(id: number) {
    const ok = await notify.confirmDelete("Delete message?", "This will permanently remove it from the inbox.");
    if (!ok) return;
    const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    if (!res.ok) {
      notify.error("Delete failed", "The message could not be deleted.");
      return;
    }
    setMessages((prev) => prev.filter((message) => message.id !== id));
    notify.toast("Message deleted");
    router.refresh();
  }

  if (messages.length === 0) {
    return <EmptyState title="Inbox is empty" message="Contact-form messages will land here." />;
  }

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
        <SearchField value={query} onChange={setQuery} placeholder="Search sender, email or message…" />
        <FilterChips label="Filter by status" value={filter} onChange={setFilter} options={FILTERS} counts={counts} />
      </div>

      <p className="mt-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {visible.length} of {messages.length} messages
        {counts.NEW ? ` · ${counts.NEW} unread` : ""}
      </p>

      {visible.length === 0 ? (
        <EmptyState title="No messages match" message="Try a different search term or filter." />
      ) : (
        <ul className="space-y-3">
          {visible.map((message) => (
            <li
              key={message.id}
              className={`rounded-2xl border bg-white p-4 shadow-sm transition-colors ${
                message.status === "NEW" ? "border-sky-200 ring-1 ring-sky-100" : "border-gray-100"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                    message.status === "NEW" ? "bg-sky-100 text-sky-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {message.name.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="min-w-0 truncate text-sm font-bold text-gray-900">
                      {message.name}
                      <a
                        href={`mailto:${message.email}`}
                        className="ml-2 text-xs font-medium text-gray-500 hover:text-[#FF4500] hover:underline"
                      >
                        {message.email}
                      </a>
                    </p>
                    <StatusBadge status={message.status} />
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {formatDateTime(message.createdAt)}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {message.message}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.status === "NEW" && (
                      <button
                        onClick={() => setStatus(message, "READ")}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-200"
                      >
                        <MailOpen className="h-3.5 w-3.5" /> Mark read
                      </button>
                    )}
                    {message.status !== "REPLIED" && (
                      <a
                        href={`mailto:${message.email}?subject=${encodeURIComponent(
                          "Re: Your message to KonnectTech"
                        )}`}
                        onClick={() => setStatus(message, "REPLIED")}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF4500]/10 px-3 py-1.5 text-xs font-bold text-[#c2410c] transition-colors hover:bg-[#FF4500]/20"
                      >
                        <Reply className="h-3.5 w-3.5" /> Reply by email
                      </a>
                    )}
                    {message.status !== "NEW" && (
                      <button
                        onClick={() => setStatus(message, "NEW")}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50"
                        title="Move back to unread"
                      >
                        <Mail className="h-3.5 w-3.5" /> Mark unread
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
