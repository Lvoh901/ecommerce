"use client";
import { CircleCheck, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle the form submission, e.g., send the email to your backend
        console.log(`Email submitted: ${email}`);
        setSubmitted(true);
        setEmail("");
    };

    return (
        <div className="flex justify-center">
            <section
                className="bg-gradient-to-br from-gray-900 via-gray-800 to-[#2e2a25] rounded-3xl p-4 sm:p-8 md:p-12 m-3 md:m-8 mx-auto container shadow-lg overflow-hidden relative"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JhZGllbnR8ZW58MHx8MHx8fDA%3D')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/60 z-0"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-12">
                    {/* Left -- Content */}
                    <div className="flex flex-col justify-center items-start px-2 py-6">
                        <div className="flex gap-2 items-center">
                            <h2 className="font-extrabold mb-4 leading-tight transition-all bg-gradient-to-r from-[#FF4500] to-orange-300 bg-clip-text text-transparent">
                                Get 10% OFF
                            </h2>

                            <h2 className="text-white font-extrabold mb-4 leading-tight transition-all">
                                your first order!
                            </h2>
                        </div>

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
                                className="bg-[#FF4500] hover:bg-[#d04000] text-white font-bold px-6 py-3 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
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