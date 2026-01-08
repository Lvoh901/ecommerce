import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { featuredCategories } from "@/data";

// Utility to remove duplicates by name
const uniqueProducts = featuredCategories.filter(
    (item, index, self) =>
        index === self.findIndex((p) => p.name.toLowerCase() === item.name.toLowerCase())
);

export default function Featured() {
    return (
        <div className="bg-gradient-to-br from-white via-gray-100 to-gray-200 py-16">
            <div className="container mx-auto px-4">
                <h4 className="text-center font-extrabold tracking-wide text-gray-800 mb-8 underline underline-offset-8 decoration-[#FF4500]">
                    Featured Products
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {uniqueProducts.map((product, idx) => (
                        <Link
                            href={product.link}
                            key={product.name}
                            className={`
                                group relative flex flex-col justify-end items-center h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-[1px] border-gray-100 hover:border-[#bcbcbc]
                            `}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 w-full h-full">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                    sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
                                    priority={idx < 4}
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40"></div>
                            </div>
                            {/* Card Content */}
                            <div className="relative z-10 w-full flex flex-col items-center text-center p-6">
                                <h4 className="font-semibold mb-1 text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.60)]">{product.name}</h4>

                                <p className="text-gray-200 mb-2">
                                    From: <b className="text-[#FF4500] italic">Ksh.{product.from}</b>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="flex justify-center">
                    <Link href="/categories" className="custom-btn pt-12 flex items-center gap-2 text-lg font-bold">
                        View All Categories{" "}
                        <ArrowRight className="w-5 h-5 text-[#FF4500] font-bold" />
                    </Link>
                </div>
            </div>
        </div>
    )
}