"use client";

import { ShoppingCart, Search, User, Menu, X, Wrench, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Me {
    name: string;
    email: string;
    role: "ADMIN" | "STAFF" | "CUSTOMER";
    image: string | null;
}

const LINKS = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/book-service", label: "Repairs" },
    { href: "/contact", label: "Contact" },
];

export default function Navigation() {
    const { totalItems } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [me, setMe] = useState<Me | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [bannerVisible, setBannerVisible] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => setMe(data.user ?? null))
            .catch(() => setMe(null));
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setMenuOpen(false);
            router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const accountHref = !me ? "/login" : me.role === "CUSTOMER" ? "/profile" : "/admin";
    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

    return (
        <header className="fixed w-full z-50">
            {/* Announcement strip */}
            {bannerVisible && (
                <div className="bg-[#FF4500] text-white text-xs sm:text-sm">
                    <div className="container mx-auto px-4 py-1.5 flex items-center justify-center gap-2 font-semibold tracking-wide">
                        <Truck className="w-4 h-4 shrink-0" />
                        <span className="truncate">Free delivery within Nairobi · Expert repairs in-store</span>
                        <button
                            onClick={() => setBannerVisible(false)}
                            aria-label="Dismiss announcement"
                            className="ml-2 rounded-full p-0.5 hover:bg-black/20 transition-colors shrink-0"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Main bar */}
            <div
                className={`bg-[#05070f]/85 backdrop-blur-xl text-gray-300 border-b border-white/10 transition-shadow ${
                    scrolled ? "shadow-[0_12px_40px_-12px_rgba(255,69,0,0.45)]" : "shadow-[0_8px_30px_-12px_rgba(255,69,0,0.35)]"
                }`}
            >
                <section className="container mx-auto px-4 h-16 flex items-center gap-3">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="KonnectTech home">
                        <span className="relative flex w-8 h-8 items-center justify-center rounded-xl bg-[#FF4500] font-extrabold text-white text-lg shadow-[0_0_18px_rgba(255,69,0,0.7)] group-hover:shadow-[0_0_26px_rgba(255,69,0,0.9)] transition-shadow">
                            K
                        </span>
                        <span className="hidden xs:block sm:block leading-none">
                            <span className="block font-extrabold tracking-widest text-white text-sm font-['Orbitron']">
                                KONNECT<span className="text-brand">TECH</span>
                            </span>
                            <span className="block text-[10px] tracking-[0.3em] text-gray-500 uppercase mt-0.5">
                                Gadgets & Repairs
                            </span>
                        </span>
                    </Link>

                    {/* Desktop links */}
                    <nav className="hidden lg:flex items-center gap-1 ml-4" aria-label="Primary">
                        {LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3.5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all ${
                                    isActive(link.href)
                                        ? "bg-[#FF4500]/15 text-white shadow-[inset_0_0_0_1px_rgba(255,69,0,0.45)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Search */}
                    <div className="flex-1 max-w-md mx-auto hidden md:block">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search gadgets, brands, categories…"
                                className="w-full bg-white/10 text-white placeholder-gray-500 rounded-full py-2 px-4 pr-11 text-sm border border-white/10 focus:outline-none focus:border-[#FF4500]/60 focus:bg-white/15 focus:shadow-[0_0_16px_rgba(255,69,0,0.35)] transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                aria-label="Search"
                                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FF4500] text-white flex items-center justify-center hover:brightness-110 transition-all"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 ml-auto">
                        <Link
                            href="/book-service"
                            className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-gray-300 border border-white/15 rounded-full px-3.5 py-2 hover:border-[#FF4500]/60 hover:text-white hover:shadow-[0_0_16px_rgba(255,69,0,0.3)] transition-all"
                        >
                            <Wrench className="w-3.5 h-3.5 text-brand" />
                            Book Repair
                        </Link>
                        <Link
                            href={accountHref}
                            className="flex items-center gap-2 rounded-full px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                            title={me ? `${me.name} (${me.role})` : "Sign in"}
                        >
                            {me ? (
                                <>
                                    <span className="relative w-8 h-8 rounded-full bg-[#FF4500]/15 border border-[#FF4500]/40 flex items-center justify-center overflow-hidden shrink-0">
                                        {me.image ? (
                                            <Image src={me.image} alt={me.name} fill className="object-cover" sizes="32px" />
                                        ) : (
                                            <User className="w-4 h-4 text-brand" />
                                        )}
                                    </span>
                                    <span className="hidden sm:block text-xs font-bold max-w-20 truncate">{me.name}</span>
                                </>
                            ) : (
                                <span className="text-sm font-semibold px-1">Sign In</span>
                            )}
                        </Link>
                        <Link
                            href="/cart"
                            aria-label={`Cart, ${totalItems} items`}
                            className="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-200 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/15 transition-all"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#FF4500] text-white text-[11px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow-[0_0_12px_rgba(255,69,0,0.8)]">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-gray-200 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </section>

                {/* Mobile menu */}
                {menuOpen && (
                    <nav className="lg:hidden border-t border-white/10 px-4 pt-3 pb-5 space-y-1" aria-label="Mobile">
                        <form onSubmit={handleSearch} className="relative md:hidden mb-3">
                            <input
                                type="text"
                                placeholder="Search products…"
                                className="w-full bg-white/10 text-white placeholder-gray-500 rounded-full py-2 px-4 pr-11 text-sm border border-white/10 focus:outline-none focus:border-[#FF4500]/60 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                aria-label="Search"
                                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FF4500] text-white flex items-center justify-center"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </form>
                        {LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    isActive(link.href)
                                        ? "bg-[#FF4500]/15 text-white shadow-[inset_0_0_0_1px_rgba(255,69,0,0.45)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    )
}
