"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, KeyRound } from "lucide-react";
import type { Role } from "@prisma/client";
import { EmptyState } from "../components";
import { notify } from "@/lib/notify";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const ROLES: Role[] = ["ADMIN", "STAFF", "CUSTOMER"];

export default function UserManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: AdminUser[];
  currentUserId: number;
}) {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);

  async function setRole(user: AdminUser, role: Role) {
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (!res.ok) {
      notify.error("Role update failed", data.error || "The role was not changed.");
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === user.id ? data.user : u)));
    notify.toast(`${user.email} → ${role}`);
    router.refresh();
  }

  async function resetPassword(user: AdminUser) {
    const password = await notify.promptPassword(`New password for ${user.email}`);
    if (!password) return;
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      notify.error("Password reset failed", data.error || "The password was not changed.");
      return;
    }
    notify.success("Password updated", `The password for ${user.email} was changed.`);
  }

  async function handleDelete(user: AdminUser) {
    const ok = await notify.confirmDelete(
      `Remove ${user.email}?`,
      "Their orders and bookings are kept, but they will lose system access."
    );
    if (!ok) return;
    const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      notify.error("Delete failed", data.error || "The user could not be removed.");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    notify.toast("User removed");
    router.refresh();
  }

  if (users.length === 0) return <EmptyState message="No users registered yet." />;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-100">
            <th className="px-4 py-3 font-semibold">User</th>
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Joined</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <p className="font-semibold text-gray-900">
                  {u.name} {u.id === currentUserId && <span className="text-xs text-gray-400">(you)</span>}
                </p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </td>
              <td className="px-4 py-3">
                <select
                  value={u.role}
                  disabled={u.id === currentUserId}
                  onChange={(e) => setRole(u, e.target.value as Role)}
                  className="text-xs font-bold rounded-full px-2 py-1.5 border border-gray-200 bg-gray-50 outline-none cursor-pointer disabled:opacity-50"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button onClick={() => resetPassword(u)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" aria-label={`Reset password for ${u.email}`} title="Reset password">
                    <KeyRound className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(u)}
                    disabled={u.id === currentUserId}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-40"
                    aria-label={`Delete ${u.email}`}
                    title="Delete user"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
