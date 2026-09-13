"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MailOpen, Reply, Trash2 } from "lucide-react";
import type { Message, MessageStatus } from "@prisma/client";
import { StatusBadge, EmptyState } from "../components";
import { notify } from "@/lib/notify";

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

  async function setStatus(message: Message, status: MessageStatus) {
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
    setMessages((prev) => prev.map((m) => (m.id === message.id ? data.message : m)));
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
    setMessages((prev) => prev.filter((m) => m.id !== id));
    notify.toast("Message deleted");
    router.refresh();
  }

  const visible = filter === "ALL" ? messages : messages.filter((m) => m.status === filter);

  if (messages.length === 0) return <EmptyState message="Inbox is empty. Contact-form messages will land here." />;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {["ALL", "NEW", "READ", "REPLIED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${filter === s ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-200"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((m) => (
          <div key={m.id} className={`bg-white rounded-2xl shadow-sm p-5 ${m.status === "NEW" ? "ring-2 ring-blue-100" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-bold text-gray-900">{m.name} <span className="font-normal text-gray-500 text-sm">· {m.email}</span></p>
                <p className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString()}</p>
              </div>
              <StatusBadge status={m.status} />
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{m.message}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {m.status === "NEW" && (
                <button onClick={() => setStatus(m, "READ")} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">
                  <MailOpen className="w-3.5 h-3.5" /> Mark read
                </button>
              )}
              {m.status !== "REPLIED" && (
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent("Re: Your message to KonnectTech")}`}
                  onClick={() => setStatus(m, "REPLIED")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#FF4500]/10 hover:bg-[#FF4500]/20 text-[#FF4500]"
                >
                  <Reply className="w-3.5 h-3.5" /> Reply by email
                </a>
              )}
              {isAdmin && (
                <button onClick={() => handleDelete(m.id)} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {visible.length === 0 && <EmptyState message={`No messages with status ${filter}.`} />}
    </div>
  );
}
