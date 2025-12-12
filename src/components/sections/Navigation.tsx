import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function Navigation() {
    return (
        <div className="bg-gray-800 text-[#bcbcbc] fixed w-full z-50">
            <section className="container mx-auto p-4 flex justify-between items-center gap-3">
                <div className="flex justify-between gap-3">
                    <Link href="/" className="hover:text-white hover:font-medium uppercase">Home</Link>
                    <Link href="/categories" className="hover:text-white hover:font-medium uppercase">Categories</Link>
                </div>

                <h3 className="text-white font-bold">KonnectTech</h3>

                <div className="flex justify-between items-center gap-3">
                    <Link href="/contact" className="hover:text-white hover:font-medium uppercase">Contact</Link>
                    <Link href="/cart" className="hover:text-white hover:font-medium uppercase"><ShoppingCart className="w-5 h-5" /></Link>
                </div>
            </section>
        </div>
    )
}