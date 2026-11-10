"use client";

import {
    ShoppingCart,
    Search,
    User,
    Menu,
    X,
    Wrench,
    Truck,
    ChevronDown,
    Home,
    LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useEffect, useRef, useState } from "react";
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

/** Categories are cached for the session so the menu is instant on later pages. */
let categoryCache: string[] | null = null;

export default function Navigation() {
    const { totalItems } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [me, setMe] = useState<Me | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const [bannerVisible, setBannerVisible] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [categories, setCategories] = useState<string[]>(categoryCache ?? []);
    const shopRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => setMe(data.user ?? null))
            .catch(() => setMe(null));
    }, []);

    useEffect(() => {
        if (categoryCache) return;
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                const names = Array.from(
                    new Set<string>((data.products ?? []).map((p: { category: string }) => p.category)),
                ).sort((a, b) => a.localeCompare(b));
                categoryCache = names;
                setCategories(names);
            })
            .catch(() => undefined);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close overlays on Escape or an outside click.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
                setShopOpen(false);
            }
        };
        const onClick = (e: MouseEvent) => {
            if (shopRef.current && !shopRef.current.contains(e.target as Node)) setShopOpen(false);
        };
        document.addEventListener("keydown", onKey);
        document.addEventListener("mousedown", onClick);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("mousedown", onClick);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setMenuOpen(false);
            router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const accountHref = !me ? "/login" : me.role === "CUSTOMER" ? "/profile" : "/admin";
    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    const searchField = (
        <form onSubmit={handleSearch} className="relative w-full">
            <input
                type="search"
                placeholder="Search gadgets, brands, categories…"
                aria-label="Search products"
                className="w-full bg-white/10 text-white placeholder-gray-400 rounded-full py-2 pl-4 pr-11 text-sm border border-white/10 focus:outline-none focus:border-[#FF4500]/70 focus:bg-white/15 transition-all"
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
    );

    return (
        <>
            <header className="sticky top-0 z-50">
                {/* Announcement strip */}
                {bannerVisible && (
                    <div className="bg-[#FF4500] text-white text-xs sm:text-sm">
                        <div className="mx-auto max-w-7xl px-4 py-1.5 flex items-center justify-center gap-2 font-semibold tracking-wide">
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
                    className={`bg-[#05070f]/95 backdrop-blur-xl text-gray-300 border-b border-white/10 transition-shadow ${
                        scrolled
                            ? "shadow-[0_12px_40px_-16px_rgba(255,69,0,0.5)]"
                            : "shadow-[0_8px_30px_-16px_rgba(255,69,0,0.35)]"
                    }`}
                >
                    <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-3">
                        {/* Brand */}
                        <Link
                            href="/"
                            onClick={() => {
                                setMenuOpen(false);
                                setShopOpen(false);
                            }}
                            className="flex items-center gap-2.5 shrink-0 group"
                            aria-label="KonnectTech home"
                        >
                            <span className="relative flex w-8 h-8 items-center justify-center rounded-xl bg-[#FF4500] font-extrabold text-white text-lg shadow-[0_0_18px_rgba(255,69,0,0.7)] group-hover:shadow-[0_0_26px_rgba(255,69,0,0.9)] transition-shadow">
                                K
                            </span>
                            <span className="leading-none">
                                <span className="block font-extrabold tracking-widest text-white text-sm font-['Orbitron']">
                                    KONNECT<span className="text-brand">TECH</span>
                                </span>
                                <span className="hidden xs:block text-[10px] tracking-[0.3em] text-gray-500 uppercase mt-0.5">
                                    Gadgets &amp; Repairs
                                </span>
                            </span>
                        </Link>

                        {/* Desktop links */}
                        <nav className="hidden lg:flex items-center gap-1 ml-4" aria-label="Primary">
                            <Link
                                href="/"
                                className={`px-3.5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all ${
                                    isActive("/")
                                        ? "bg-[#FF4500]/15 text-white shadow-[inset_0_0_0_1px_rgba(255,69,0,0.45)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                Home
                            </Link>

                            <div className="relative" ref={shopRef}>
                                <button
                                    type="button"
                                    onClick={() => setShopOpen((v) => !v)}
                                    aria-expanded={shopOpen}
                                    aria-haspopup="true"
                                    className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all ${
                                        isActive("/shop") || shopOpen
                                            ? "bg-[#FF4500]/15 text-white shadow-[inset_0_0_0_1px_rgba(255,69,0,0.45)]"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    Shop
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 transition-transform ${shopOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {shopOpen && (
                                    <div className="absolute left-0 top-full mt-2 w-[34rem] rounded-2xl border border-white/10 bg-[#0b1120]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                                        <div className="grid grid-cols-2 gap-1 p-3">
                                            <Link
                                                href="/shop"
                                                onClick={() => setShopOpen(false)}
                                                className="col-span-2 flex items-center justify-between rounded-xl bg-[#FF4500]/10 border border-[#FF4500]/30 px-4 py-3 text-sm font-bold text-white hover:bg-[#FF4500]/20 transition-colors"
                                            >
                                                Shop all products
                                                <span className="text-xs font-semibold text-gray-400">
                                                    {categories.length > 0 ? `${categories.length} categories` : "Browse"}
                                                </span>
                                            </Link>
                                            {categories.map((category) => (
                                                <Link
                                                    key={category}
                                                    href={`/shop?category=${encodeURIComponent(category)}`}
                                                    onClick={() => setShopOpen(false)}
                                                    className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                                >
                                                    {category}
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="border-t border-white/10 px-4 py-3 flex items-center justify-between text-xs text-gray-400">
                                            <span>Need a fix instead?</span>
                                            <Link
                                                href="/book-service"
                                                onClick={() => setShopOpen(false)}
                                                className="font-bold text-[#FF4500] hover:underline"
                                            >
                                                Book a repair →
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {LINKS.slice(2).map((link) => (
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
                        <div className="hidden md:block flex-1 max-w-md mx-auto">{searchField}</div>

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
                                className="flex items-center gap-2 rounded-full px-2.5 sm:px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
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
                                    <span className="text-sm font-semibold px-1 hidden sm:inline">Sign In</span>
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
                    </div>

                    {/* Mobile menu */}
                    {menuOpen && (
                        <div className="lg:hidden border-t border-white/10 bg-[#05070f] max-h-[calc(100vh-8rem)] overflow-y-auto">
                            <div className="px-4 pt-4 pb-6 space-y-1">
                                <div className="md:hidden mb-3">{searchField}</div>

                                {LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMenuOpen(false)}
                                        className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                            isActive(link.href)
                                                ? "bg-[#FF4500]/15 text-white shadow-[inset_0_0_0_1px_rgba(255,69,0,0.45)]"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                {categories.length > 0 && (
                                    <div className="pt-4">
                                        <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
                                            Shop by category
                                        </p>
                                        <div className="flex flex-wrap gap-2 px-1">
                                            {categories.map((category) => (
                                                <Link
                                                    key={category}
                                                    href={`/shop?category=${encodeURIComponent(category)}`}
                                                    onClick={() => setMenuOpen(false)}
                                                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:border-[#FF4500]/50 hover:text-white transition-colors"
                                                >
                                                    {category}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 grid grid-cols-2 gap-2">
                                    <Link
                                        href="/cart"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm font-bold text-gray-200 hover:border-[#FF4500]/50 transition-colors"
                                    >
                                        <ShoppingCart className="w-4 h-4" /> Cart ({totalItems})
                                    </Link>
                                    <Link
                                        href={accountHref}
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm font-bold text-gray-200 hover:border-[#FF4500]/50 transition-colors"
                                    >
                                        <User className="w-4 h-4" /> {me ? "Account" : "Sign In"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Mobile quick navigation */}
            <nav
                aria-label="Quick navigation"
                className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#05070f]/95 backdrop-blur-xl"
            >
                <div className="grid grid-cols-5">
                    {[
                        { href: "/", label: "Home", icon: Home },
                        { href: "/shop", label: "Shop", icon: LayoutGrid },
                        { href: "/book-service", label: "Repairs", icon: Wrench },
                        { href: "/cart", label: "Cart", icon: ShoppingCart },
                        { href: accountHref, label: me ? "Account" : "Sign In", icon: User },
                    ].map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                    active ? "text-[#FF4500]" : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                                {item.href === "/cart" && totalItems > 0 && (
                                    <span className="absolute top-1 right-1/2 translate-x-4 bg-[#FF4500] text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                                {active && <span className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-[#FF4500]" />}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
