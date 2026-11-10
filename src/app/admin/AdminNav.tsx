"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Wrench,
  Inbox,
  Users,
  Store,
  Mails,
  Settings,
  Menu,
  X,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

type BadgeKey = "orders" | "messages" | "bookings" | "users" | "products" | "categories" | "subscribers";

const NAV: {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  adminOnly?: boolean;
  badge?: BadgeKey;
}[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Listings", icon: Package, badge: "products" },
  { href: "/admin/categories", label: "Categories", icon: Tags, badge: "categories" },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, badge: "orders" },
  { href: "/admin/bookings", label: "Bookings", icon: Wrench, badge: "bookings" },
  { href: "/admin/messages", label: "Inbox", icon: Inbox, badge: "messages" },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mails, badge: "subscribers" },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true, badge: "users" },
];

/** Badges only flag work that needs a human: pending orders, unread mail, new bookings. */
const ATTENTION: BadgeKey[] = ["orders", "messages", "bookings"];

export default function AdminNav({
  isAdmin,
  counts,
  user,
}: {
  isAdmin: boolean;
  counts: Record<BadgeKey, number>;
  user: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = NAV.filter((item) => !item.adminOnly || isAdmin);
  const current = [...items].sort((a, b) => b.href.length - a.href.length).find(
    (item) => pathname === item.href || (!item.exact && pathname.startsWith(`${item.href}/`))
  );

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  function badgeFor(key?: BadgeKey) {
    if (!key) return null;
    const value = counts[key] ?? 0;
    if (!value || !ATTENTION.includes(key)) return null;
    return (
      <span className="ml-auto rounded-full bg-[#FF4500] px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white tabular-nums">
        {value > 99 ? "99+" : value}
      </span>
    );
  }

  function navLink(item: (typeof NAV)[number], onNavigate?: () => void) {
    const active = current?.href === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium border transition-all ${
          active
            ? "bg-white/[0.08] border-white/10 text-white shadow-[0_0_20px_rgba(255,69,0,0.18)]"
            : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-[#FF4500]" />
        )}
        <item.icon
          className={`h-5 w-5 shrink-0 transition-colors ${active ? "text-[#FF6a2b]" : "group-hover:text-[#FF6a2b]"}`}
        />
        <span className="truncate">{item.label}</span>
        {badgeFor(item.badge)}
      </Link>
    );
  }

  const userCard = (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF4500]/20 text-sm font-extrabold text-[#FF6a2b]">
          {user.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="truncate text-[11px] text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="rounded-full bg-[#FF4500]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FF6a2b]">
          {user.role}
        </span>
        <div className="flex items-center gap-1">
          <Link
            href="/profile"
            aria-label="Profile settings"
            title="Profile settings"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            aria-label="View store"
            title="View store"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Store className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  const brand = (
    <Link href="/admin" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF4500] text-sm font-black text-white">
        K
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold tracking-wide text-white">KonnectTech</span>
        <span className="block text-[10px] uppercase tracking-[0.18em] text-gray-500">Store manager</span>
      </span>
    </Link>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col overflow-hidden border-r border-white/10 bg-[#05070f] text-gray-300 lg:flex">
        <div className="tech-grid-dark pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FF4500]/20 blur-[90px]" />
        <div className="relative border-b border-white/10 px-5 py-5">{brand}</div>
        <nav className="relative flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item) => navLink(item))}
        </nav>
        <div className="relative space-y-2 border-t border-white/10 p-3">
          {userCard}
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile app bar */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-[#05070f] px-3 py-2.5 text-white lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={open}
          className="rounded-xl border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold leading-tight">{current?.label ?? "Dashboard"}</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-gray-500">KonnectTech admin</p>
        </div>
        <Link
          href="/"
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-300 transition-colors hover:text-white"
          aria-label="View store"
        >
          <ExternalLink className="h-5 w-5" />
        </Link>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-xs flex-col overflow-hidden border-r border-white/10 bg-[#05070f] text-gray-300 shadow-2xl">
            <div className="tech-grid-dark pointer-events-none absolute inset-0 opacity-50" />
            <div className="relative flex items-center justify-between border-b border-white/10 px-4 py-4">
              {brand}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close admin menu"
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="relative flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {items.map((item) => navLink(item, () => setOpen(false)))}
            </nav>
            <div className="relative space-y-2 border-t border-white/10 p-3">
              {userCard}
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
