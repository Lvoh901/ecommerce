"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserRound, Lock, Loader2, ArrowRight } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { notify } from "@/lib/notify";

interface Me {
  id: number;
  name: string;
  email: string;
  role: string;
  image: string | null;
}

export default function ProfileForm() {
  const [me, setMe] = useState<Me | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/login?next=/profile";
          return;
        }
        const data = await res.json();
        if (data.user) {
          setMe(data.user);
          setName(data.user.name);
          setImage(data.user.image ?? "");
        }
      })
      .catch(() => notify.error("Failed to load profile", "Network error. Please reload."));
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify.error("Update failed", data.error || "Please try again.");
        return;
      }
      setMe(data.user);
      notify.success("Profile updated", "Your name and avatar were saved.");
    } catch {
      notify.error("Update failed", "Network error. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify.error("Password change failed", data.error || "Please try again.");
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      notify.success("Password changed", "Use your new password next time you sign in.");
    } catch {
      notify.error("Password change failed", "Network error. Please try again.");
    } finally {
      setSavingPassword(false);
    }
  }

  const input =
    "block w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-[#FF4500] focus:border-[#FF4500] outline-none transition-colors";

  if (!me) {
    return (
      <div className="flex items-center justify-center gap-2 text-gray-500 py-16">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading profile…
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Profile details */}
      <div className="relative bg-white/90 backdrop-blur rounded-3xl shadow-[0_30px_70px_-20px_rgba(255,69,0,0.3)] border border-white/60 p-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#FF4500]/10 border border-[#FF4500]/20">
            <UserRound className="w-5 h-5 text-[#FF4500]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Profile settings</h1>
            <p className="text-sm text-gray-500">{me.email} · {me.role}</p>
            <Link href="/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF4500] hover:underline mt-1">
              View my orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <form onSubmit={saveProfile} className="space-y-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-[#FF4500]/30 shrink-0">
              {image ? (
                <Image src={image} alt="Avatar preview" fill className="object-cover" sizes="80px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-extrabold text-[#FF4500]">
                  {me.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <p className="font-semibold text-gray-700">Avatar</p>
              <p>Upload a square image for best results.</p>
            </div>
          </div>

          <ImageUpload value={image} onChange={setImage} endpoint="avatar" />

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
            <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className={input} />
          </div>

          <button type="submit" disabled={savingProfile} className="w-full btn-primary text-white font-bold py-3 rounded-xl disabled:opacity-60">
            {savingProfile ? "Saving…" : "Save profile"}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="relative bg-white/90 backdrop-blur rounded-3xl shadow-[0_30px_70px_-20px_rgba(255,69,0,0.3)] border border-white/60 p-8 h-fit">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#FF4500]/10 border border-[#FF4500]/20">
            <Lock className="w-5 h-5 text-[#FF4500]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Change password</h2>
            <p className="text-sm text-gray-500">Confirm your current password first.</p>
          </div>
        </div>

        <form onSubmit={changePassword} className="space-y-4 mt-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
            <input
              id="currentPassword"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={input}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input
              id="newPassword"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={input}
              placeholder="At least 8 characters"
            />
          </div>
          <button type="submit" disabled={savingPassword} className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all">
            {savingPassword ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
