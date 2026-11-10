"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, KeyRound, ShieldCheck } from "lucide-react";
import type { Role } from "@prisma/client";
import { EmptyState, formatDate } from "../components";
import { FilterChips, SearchField } from "../ui";
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

const ROLE_TONE: Record<Role, string> = {
  ADMIN: "bg-[#FF4500]/10 text-[#c2410c] ring-[#FF4500]/20",
  STAFF: "bg-violet-50 text-violet-700 ring-violet-200",
  CUSTOMER: "bg-gray-100 text-gray-600 ring-gray-200",
};

export default function UserManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: AdminUser[];
  currentUserId: number;
}) {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string>("ALL");

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: users.length };
    users.forEach((user) => {
      map[user.role] = (map[user.role] ?? 0) + 1;
    });
    return map;
  }, [users]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = role === "ALL" || user.role === role;
      const matchesQuery = !needle || `${user.name} ${user.email}`.toLowerCase().includes(needle);
      return matchesRole && matchesQuery;
    });
  }, [users, query, role]);

  async function setUserRole(user: AdminUser, next: Role) {
    if (next === user.role) return;
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: next }),
    });
    const data = await res.json();
    if (!res.ok) {
      notify.error("Role update failed", data.error || "The role was not changed.");
      return;
    }
    setUsers((prev) => prev.map((item) => (item.id === user.id ? data.user : item)));
    notify.toast(`${user.email} → ${next.toLowerCase()}`);
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
    setUsers((prev) => prev.filter((item) => item.id !== user.id));
    notify.toast("User removed");
    router.refresh();
  }

  if (users.length === 0) return <EmptyState message="Accounts created on the storefront will appear here." />;

  const roleSelect = (user: AdminUser) => (
    <select
      value={user.role}
      disabled={user.id === currentUserId}
      onChange={(event) => setUserRole(user, event.target.value as Role)}
      aria-label={`Role for ${user.email}`}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold text-gray-800 outline-none focus:border-[#FF4500] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {ROLES.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  const actions = (user: AdminUser) => (
    <div className="flex justify-end gap-1">
      <button
        onClick={() => resetPassword(user)}
        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        aria-label={`Reset password for ${user.email}`}
        title="Reset password"
      >
        <KeyRound className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleDelete(user)}
        disabled={user.id === currentUserId}
        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-40"
        aria-label={`Delete ${user.email}`}
        title={user.id === currentUserId ? "You cannot delete your own account" : "Delete user"}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
        <SearchField value={query} onChange={setQuery} placeholder="Search by name or email…" />
        <FilterChips
          label="Filter by role"
          value={role}
          onChange={setRole}
          counts={counts}
          options={[
            { value: "ALL", label: "All" },
            ...ROLES.map((option) => ({
              value: option,
              label: option.charAt(0) + option.slice(1).toLowerCase(),
            })),
          ]}
        />
      </div>

      <p className="mt-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {visible.length} of {users.length} accounts
      </p>

      {visible.length === 0 ? (
        <EmptyState title="No accounts match" message="Try a different name, email or role." />
      ) : (
        <>
          <ul className="space-y-2 lg:hidden">
            {visible.map((user) => (
              <li key={user.id} className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-extrabold text-gray-600">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {user.name}
                      {user.id === currentUserId && <span className="ml-1 text-xs text-gray-400">(you)</span>}
                    </p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                    <p className="mt-1 text-[11px] text-gray-400">
                      Joined {formatDate(user.createdAt)}
                    </p>
                  </div>
                  {actions(user)}
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 border-t border-gray-100 pt-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${ROLE_TONE[user.role]}`}>
                    {user.role}
                  </span>
                  {roleSelect(user)}
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visible.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-gray-50/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-extrabold text-gray-600">
                          {user.name.slice(0, 1).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 font-semibold text-gray-900">
                            {user.name}
                            {user.id === currentUserId && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                <ShieldCheck className="h-3 w-3" /> you
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${ROLE_TONE[user.role]}`}
                        >
                          {user.role}
                        </span>
                        {roleSelect(user)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">{actions(user)}</td>
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
