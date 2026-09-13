"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          Loading…
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      const role = data.user?.role;
      router.push(role === "CUSTOMER" ? "/" : next);
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
        <div className="flex items-center gap-3 mb-1">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#FF4500]/10 border border-[#FF4500]/20 shadow-[0_0_20px_rgba(255,69,0,0.25)]">
            <LogIn className="w-7 h-7 text-[#FF4500]" />
          </div>

          <h2 className="font-bold text-gray-900">Welcome back</h2>
        </div>

        <p className="font-medium mb-6 text-center">
          Sign in to your KonnectTech account.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold mb-1 uppercase"
            >
              Email
            </label>
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
            <label
              htmlFor="password"
              className="block text-sm font-bold mb-1 uppercase"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-[#FF4500] focus:border-[#FF4500] outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-white font-bold py-3 rounded-xl disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500 text-center">
          No account?{" "}
          <Link
            href="/register"
            className="text-[#FF4500] font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>

        <div className="flex justify-center">
          <Link
            href="/"
            className="mt-3 text-white bg-gray-500 py-1 px-2.5 hover:bg-gray-700 rounded-md"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
