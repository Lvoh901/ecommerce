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
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-[0_30px_70px_-20px_rgba(255,69,0,0.3)] border border-white/60 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-['Orbitron']">Send us a Message</h3>
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
                            className="block w-full px-4 py-3 rounded-md border-gray-300 bg-gray-50 focus:bg-white focus:ring-[#FF4500] focus:border-[#FF4500] transition-colors"
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
                            className="block w-full px-4 py-3 rounded-md border-gray-300 bg-gray-50 focus:bg-white focus:ring-[#FF4500] focus:border-[#FF4500] transition-colors"
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
                            className="block w-full px-4 py-3 rounded-md border-gray-300 bg-gray-50 focus:bg-white focus:ring-[#FF4500] focus:border-[#FF4500] transition-colors"
                            placeholder="How can we help you?"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full btn-primary flex justify-center items-center py-3 px-4 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4500]"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        {status === "sending" ? "Sending…" : "Send Message"}
                    </button>
                </div>
            </form>
        </div>
    );
}
