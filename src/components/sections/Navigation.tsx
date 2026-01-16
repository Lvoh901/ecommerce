"use client";

import { ShoppingCart, Search } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navigation() {
    const { totalItems } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="bg-gray-800 text-[#bcbcbc] fixed w-full z-50">
            <section className="container mx-auto p-4 flex justify-between items-center gap-3">
                <div className="flex justify-between gap-3 items-center">
                    <Link href="/" className="hover:text-white hover:font-medium uppercase">Home</Link>
                    <Link href="/shop" className="hover:text-white hover:font-medium uppercase">Shop</Link>
                </div>

                <div className="flex-1 max-w-md mx-4 hidden md:block">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full bg-gray-700 text-white rounded-full py-1 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                            <Search className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/contact" className="hover:text-white hover:font-medium uppercase hidden sm:block">Contact</Link>
                        <Link href="/cart" className="hover:text-white hover:font-medium uppercase relative">
                            <ShoppingCart className="w-6 h-6" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}