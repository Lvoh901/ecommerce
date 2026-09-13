"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, X, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notify } from "@/lib/notify";

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState("");
    const [orderId, setOrderId] = useState<number | null>(null);

    async function placeOrder(e: React.FormEvent) {
        e.preventDefault();
        setPlacing(true);
        setError("");
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    items: cart.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data.error || "Checkout failed.");
                return;
            }
            setOrderId(data.order.id);
            clearCart();
            setShowCheckout(false);
            notify.success("Order placed!", `Order #${data.order.id} is confirmed. We'll contact you about delivery.`);
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setPlacing(false);
        }
    }

    if (orderId !== null) {
        return (
            <main className="flex-grow flex flex-col items-center justify-center pt-28 pb-16 px-4 text-center">
                <div className="bg-white p-12 rounded-3xl shadow-lg max-w-lg w-full">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <h4 className="font-bold text-gray-900 mb-4 text-xl">Order #{orderId} placed!</h4>
                    <p className="text-gray-500 mb-8">Thank you for shopping with KonnectTech. We&apos;ll contact you shortly to confirm delivery.</p>
                    <div className="flex gap-3 justify-center">
                        <Link href="/shop" className="inline-flex items-center px-4 py-2 text-lg font-bold rounded-xl text-white bg-[#FF4500] hover:bg-orange-700 transition-all">
                            Continue Shopping <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link href="/orders" className="inline-flex items-center px-4 py-2 text-lg font-bold rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
                            My Orders
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (cart.length === 0) {
        return (
            <main className="flex-grow flex flex-col items-center justify-center pt-28 pb-16 px-4 text-center">
                <div className="bg-white p-12 rounded-3xl shadow-lg max-w-lg w-full">
                    <div className="w-16 h-16 bg-gray-100 border border-[#FF4500] rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-[#FF4500]" />
                    </div>

                    <h4 className="font-bold text-gray-900 mb-4 font-['Orbitron']">Your Cart is Empty</h4>
                    <p className="text-gray-500 mb-8 text-lg">Looks like you haven&apos;t added anything to your cart yet.</p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-lg font-bold rounded-xl text-white bg-[#FF4500] hover:bg-orange-700 transition-all transform hover:scale-105"
                    >
                        Start Shopping
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="font-bold text-gray-900 mb-10 font-['Orbitron'] border-b pb-4">
                    Your Shopping Cart <span className="text-lg text-gray-500 font-normal ml-2">({totalItems} items)</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Cart Items */}
                    <div className="lg:col-span-8 space-y-6">
                        {cart.map((item) => {
                            const {
                                id,
                                image,
                                name,
                                category,
                                price,
                                quantity
                            } = item;

                            return (
                                <div key={id} className="bg-white rounded-2xl shadow-sm p-6 flex gap-6 items-center hover:shadow-md transition-shadow">
                                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                                        <Image
                                            src={image}
                                            alt={name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-xs text-[#FF4500] font-bold uppercase tracking-wider mb-1">{category}</p>
                                                <h3 className="text-lg font-bold text-gray-900 truncate">{name}</h3>
                                            </div>
                                            <p className="text-lg font-bold text-gray-900">Ksh.{price * quantity}</p>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(id, quantity - 1)}
                                                    className="p-1 hover:bg-white rounded-md transition-colors text-gray-600 disabled:opacity-50"
                                                    disabled={quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-bold text-gray-900">{quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(id, quantity + 1)}
                                                    className="p-1 hover:bg-white rounded-md transition-colors text-gray-600"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(id)}
                                                className="flex items-center text-red-500 hover:text-red-700 font-medium text-sm transition-colors group"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-32">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 font-['Orbitron']">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>Ksh.{totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-extrabold text-[#FF4500]">Ksh.{totalPrice}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => { setShowCheckout(true); setError(""); }}
                                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all transform active:scale-95 shadow-md hover:shadow-lg flex justify-center items-center group"
                            >
                                Proceed to Checkout
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="mt-4 text-xs text-gray-400 text-center">
                                Secure Checkout - SSL Encrypted
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {showCheckout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Checkout details</h2>
                            <button onClick={() => setShowCheckout(false)} className="p-1.5 rounded-lg hover:bg-gray-100" aria-label="Close">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-3">{error}</p>}
                        <form onSubmit={placeOrder} className="space-y-3">
                            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF4500] outline-none" />
                            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF4500] outline-none" />
                            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone (optional)" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF4500] outline-none" />
                            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Delivery address (optional)" rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF4500] outline-none" />
                            <p className="text-sm text-gray-600">Total: <span className="font-extrabold text-[#FF4500]">Ksh.{totalPrice.toLocaleString()}</span> ({totalItems} items)</p>
                            <button type="submit" disabled={placing} className="w-full bg-[#FF4500] hover:bg-orange-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl">
                                {placing ? "Placing order…" : "Place Order"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
