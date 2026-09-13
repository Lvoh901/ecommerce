import Link from "next/link";
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
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Listings", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/bookings", label: "Bookings", icon: Wrench },
  { href: "/admin/messages", label: "Inbox", icon: Inbox },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mails },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("STAFF");
  const isAdmin = session.role === "ADMIN";

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="relative w-60 shrink-0 bg-[#05070f] text-gray-300 hidden md:flex flex-col sticky top-0 h-screen border-r border-white/10 overflow-hidden">
        <div className="absolute inset-0 tech-grid-dark opacity-50 pointer-events-none"></div>
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#FF4500]/20 blur-[90px] rounded-full pointer-events-none"></div>
        <div className="relative px-6 py-6 border-b border-white/10">
          <p className="text-lg font-bold tracking-wide"><span className="text-brand">KonnectTech</span></p>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Store Manager</p>
        </div>
        <nav className="relative flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.filter((item) => !item.adminOnly || isAdmin).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium border border-transparent hover:bg-white/5 hover:text-white hover:border-white/10 hover:shadow-[0_0_18px_rgba(255,69,0,0.25)] transition-all"
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="relative px-4 py-4 border-t border-white/10 space-y-3">
          <div className="px-2">
            <p className="text-sm text-white font-semibold truncate">{session.name}</p>
            <p className="text-xs text-gray-500 truncate">{session.email}</p>
            <span className="inline-block mt-1 text-[11px] font-bold uppercase tracking-wider bg-[#FF4500]/20 text-[#FF6a2b] px-2 py-0.5 rounded-full">
              {session.role}
            </span>
          </div>
          <Link
            href="/profile"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" /> Profile settings
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Store className="w-4 h-4" /> View store
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top nav */}
        <div className="md:hidden bg-[#05070f] text-gray-200 px-4 py-3 flex items-center gap-2 overflow-x-auto sticky top-0 z-10 border-b border-white/10">
          {NAV.filter((item) => !item.adminOnly || isAdmin).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 hover:bg-gray-700 whitespace-nowrap"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
          <Link
            href="/profile"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 hover:bg-gray-700 whitespace-nowrap"
          >
            <Settings className="w-4 h-4" />
            Profile
          </Link>
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
