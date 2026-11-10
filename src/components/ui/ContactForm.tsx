"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { notify } from "@/lib/notify";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        setError("");
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data.error || "Failed to send message.");
                setStatus("error");
                return;
            }
            setStatus("sent");
            setFormData({ name: "", email: "", message: "" });
            notify.success("Message sent!", "Thanks for reaching out. We'll get back to you soon.");
        } catch {
            setError("Network error. Please try again.");
            setStatus("error");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            {status === "sent" && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
                    Thanks for contacting us! We&apos;ll get back to you soon.
                </div>
            )}
            {status === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700"> Name </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#FF4500] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20"
                            placeholder="Your Name"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700"> Email </label>
                    <div className="mt-1">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#FF4500] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700"> Message </label>
                    <div className="mt-1">
                        <textarea
                            id="message"
                            name="message"
                            rows={4}
                            required
                            value={formData.message}
                            onChange={handleChange}
                            className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#FF4500] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20"
                            placeholder="How can we help you?"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="btn-primary flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-70"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        {status === "sending" ? "Sending…" : "Send Message"}
                    </button>
                </div>
            </form>
        </div>
    );
}
