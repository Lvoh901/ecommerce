"use client";
import { CircleCheck, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { notify } from "@/lib/notify";

export default function CTA() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (submitted) {
            const timer = setTimeout(() => {
                setSubmitted(false);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [submitted]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/subscribers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                notify.error("Subscription failed", data.error || "Please try again.");
                return;
            }
            setSubmitted(true);
            setEmail("");
            notify.toast("Subscribed! Watch your inbox for 10% off.");
        } catch {
            notify.error("Subscription failed", "Network error. Please try again.");
        }
    };

    return (
        <div className="flex justify-center">
            <section
                className="bg-[#0b1120] rounded-3xl p-4 sm:p-8 md:p-12 m-3 md:m-8 mx-auto container shadow-[0_30px_80px_-20px_rgba(255,69,0,0.4)] overflow-hidden relative border border-white/10"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JhZGllbnR8ZW58MHx8MHx8fDA%3D')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/60 z-0"></div>
                <div className="absolute inset-0 tech-grid-dark opacity-70 z-0 pointer-events-none"></div>
                <div className="absolute -top-20 right-10 w-80 h-80 bg-[#FF4500]/15 blur-[110px] rounded-full z-0 pointer-events-none"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-12">
                    {/* Left -- Content */}
                    <div className="flex flex-col justify-center items-start px-2 py-6">
                        <h2 className="mb-4 font-extrabold leading-tight text-white">
                            Get <span className="text-[#FF4500]">10% OFF</span> your first order!
                        </h2>

                        <p className="text-gray-200 text-base sm:text-lg mb-6">
                            Subscribe to our newsletter and be the first to know about exclusive offers, new arrivals, and community events!
                        </p>

                        <form
                            className="flex flex-col sm:flex-row w-full max-w-md gap-3"
                            onSubmit={handleSubmit}
                            autoComplete="off"
                            aria-label="Newsletter subscription form"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter your Email"
                                required
                                aria-label="Email address for newsletter"
                                className="flex-1 outline-none bg-transparent border-0 border-b-2 border-gray-400 py-3 px-2 text-white placeholder-gray-400 focus:border-[#FF4500] focus:ring-0 transition-colors duration-200"
                            />
                            <button
                                type="submit"
                                className="btn-primary text-white font-bold px-6 py-3 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                disabled={submitted || !email}
                                aria-label="Subscribe to newsletter"
                            >
                                {submitted ? (
                                    <>
                                        <CheckCircle2 className="w-5 h-5 mr-2" />
                                        Thank you!
                                    </>
                                ) : "Subscribe"}
                            </button>
                        </form>

                        <div className="mt-5 flex items-center gap-2 text-sm text-gray-300">
                            <CircleCheck className="text-[#FF4500] w-5 h-5" />
                            <span>
                                {submitted ? "You're on the list!" : "Join 10,000+ others in our newsletter"}
                            </span>
                        </div>
                    </div>

                    {/* Right -- Illustration */}
                    <div className="flex justify-center items-center relative mt-6 md:mt-0">
                        <div className="relative w-[250px] h-[170px] xs:w-[300px] xs:h-[190px] sm:w-[350px] sm:h-[260px] md:w-[400px] md:h-[330px] lg:w-[520px] lg:h-[380px] xl:w-[600px] xl:h-[410px]  transition-all scale-105 hover:scale-110 duration-500">
                            <Image
                                src="/cta.png"
                                alt="Exciting newsletter sign up graphic"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                                sizes="(max-width: 600px) 90vw, (max-width: 1200px) 60vw, 500px"
                            />
                            {/* Colorful decorative blobs */}
                            <div className="absolute -top-8 -left-10 w-28 h-28 bg-[#FF4500]/30 rounded-full blur-2xl z-0 animate-pulse"></div>
                            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl z-0 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}