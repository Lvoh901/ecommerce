"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }
      const role = data.user?.role;
      router.push(role === "CUSTOMER" ? "/" : "/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gray-50 px-4 overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-70 pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF4500]/15 blur-[110px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FF4500]/10 blur-[110px] rounded-full pointer-events-none"></div>
      <div className="relative bg-white/90 backdrop-blur rounded-3xl shadow-[0_30px_70px_-20px_rgba(255,69,0,0.3)] border border-white/60 p-8 w-full max-w-md">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-[#FF4500]/10 border border-[#FF4500]/20 shadow-[0_0_20px_rgba(255,69,0,0.25)]">
          <UserPlus className="w-7 h-7 text-[#FF4500]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
        <p className="text-gray-500 mb-6">Join KonnectTech to shop and track orders.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-[#FF4500] focus:border-[#FF4500] outline-none transition-colors"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-[#FF4500] focus:border-[#FF4500] outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-[#FF4500] focus:border-[#FF4500] outline-none transition-colors"
              placeholder="At least 8 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-white font-bold py-3 rounded-xl disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#FF4500] hover:underline">
            Sign in
          </Link>
        </p>

        <div className="mt-4 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-[#FF4500]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
        </div>
      </div>
    </main>
  );
}
