"use client";

import { useState } from "react";
import { Wrench, CheckCircle } from "lucide-react";
import { notify } from "@/lib/notify";

export default function BookServiceForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    device: "",
    issue: "",
    preferredAt: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          preferredAt: form.preferredAt || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Booking failed.");
        setStatus("error");
        return;
      }
      setBookingId(data.booking.id);
      setStatus("sent");
      setForm({
        name: "",
        email: "",
        phone: "",
        device: "",
        issue: "",
        preferredAt: "",
      });
      notify.success(
        "Booking received!",
        `Booking #${data.booking.id} is in. We'll contact you to confirm your slot.`,
      );
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  const input =
    "block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#FF4500] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20";

  return (
    <div className="relative rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-[0_30px_70px_-30px_rgba(255,69,0,0.35)] backdrop-blur sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#FF4500]/10 border border-[#FF4500]/20 shadow-[0_0_20px_rgba(255,69,0,0.25)]">
          <Wrench className="w-7 h-7 text-[#FF4500]" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Book a repair / service</h1>
      </div>
      <p className="text-gray-500 mb-6">
        Tell us about your device and we&apos;ll confirm your slot.
      </p>

      {status === "sent" && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          Booking #{bookingId} received! We&apos;ll contact you to confirm.
        </div>
      )}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
            className={input}
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className={input}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone"
            className={input}
          />
          <input
            required
            value={form.device}
            onChange={(e) => setForm({ ...form, device: e.target.value })}
            placeholder="Device (e.g. MacBook Pro 2021)"
            className={input}
          />
        </div>
        <textarea
          required
          value={form.issue}
          onChange={(e) => setForm({ ...form, issue: e.target.value })}
          placeholder="Describe the issue…"
          rows={4}
          className={input}
        />
        <div>
          <label
            htmlFor="preferredAt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Preferred date/time (optional)
          </label>
          <input
            id="preferredAt"
            type="datetime-local"
            value={form.preferredAt}
            onChange={(e) => setForm({ ...form, preferredAt: e.target.value })}
            className={input}
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full btn-primary text-white font-bold py-3 rounded-xl disabled:opacity-60"
        >
          {status === "sending" ? "Submitting…" : "Request Booking"}
        </button>
      </form>
    </div>
  );
}
