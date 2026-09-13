import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function Featured() {
    const categories = await prisma.category.findMany();

    return (
        <div className="relative bg-gray-100 py-16 overflow-hidden">
            <div className="absolute inset-0 tech-grid opacity-70 pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[36rem] h-56 bg-[#FF4500]/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative container mx-auto px-4">
                <div className="flex flex-col items-center gap-3 mb-8">
                    <span className="eyebrow">Curated lineup</span>
                    <h4 className="text-center font-extrabold tracking-wide">
                        <span className="text-brand">Featured Products</span>
                    </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {categories.map((product, idx) => (
                        <Link
                            href={product.link}
                            key={product.name}
                            className={`
                                group relative flex flex-col justify-end items-center h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_24px_50px_-16px_rgba(255,69,0,0.45)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer border border-gray-100 hover:border-[#FF4500]/50
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
                                <div className="absolute inset-0 bg-black/50"></div>
                                <div className="absolute inset-x-0 top-0 hairline opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            {/* Card Content */}
                            <div className="relative z-10 w-full flex flex-col items-center text-center p-6">
                                <h4 className="font-semibold mb-1 text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.60)]">{product.name}</h4>

                                <p className="text-gray-200 mb-2">
                                    From: <b className="text-brand italic">Ksh.{product.fromPrice}</b>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="flex justify-center">
                    <Link href="/shop" className="custom-btn pt-12 flex items-center gap-2 text-lg font-bold">
                        View All Products{" "}
                        <ArrowRight className="w-5 h-5 text-[#FF4500] font-bold" />
                    </Link>
                </div>
            </div>
        </div>
    )
}