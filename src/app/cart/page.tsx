"use client";

import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

    if (cart.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-grow flex flex-col items-center justify-center pt-28 pb-16 px-4 text-center">
                    <div className="bg-white p-12 rounded-3xl shadow-lg max-w-lg w-full">
                        <div className="w-16 h-16 bg-gray-100 border border-[#FF4500] rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-[#FF4500]" />
                        </div>

                        <h4 className="font-bold text-gray-900 mb-4 font-['Orbitron']">Your Cart is Empty</h4>
                        <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added anything to your cart yet.</p>
                        <Link
                            href="/categories"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-lg font-bold rounded-xl text-white bg-[#FF4500] hover:bg-orange-700 transition-all transform hover:scale-105"
                        >
                            Start Shopping
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="font-bold text-gray-900 mb-10 font-['Orbitron'] border-b pb-4">
                        Your Shopping Cart <span className="text-lg text-gray-500 font-normal ml-2">({totalItems} items)</span>
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Cart Items */}
                        <div className="lg:col-span-8 space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm p-6 flex gap-6 items-center hover:shadow-md transition-shadow">
                                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-xs text-[#FF4500] font-bold uppercase tracking-wider mb-1">{item.category}</p>
                                                <h3 className="text-lg font-bold text-gray-900 truncate">{item.name}</h3>
                                            </div>
                                            <p className="text-lg font-bold text-gray-900">Ksh.{item.price * item.quantity}</p>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:bg-white rounded-md transition-colors text-gray-600 disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:bg-white rounded-md transition-colors text-gray-600"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="flex items-center text-red-500 hover:text-red-700 font-medium text-sm transition-colors group"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                                    onClick={() => alert("Checkout functionality coming soon!")}
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
            </main>

            <Footer />
        </div>
    );
}
