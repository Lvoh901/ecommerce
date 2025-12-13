import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const featuredProducts = [
    {
        name: "Backpack",
        from: 1500,
        image: "/backpack.jpg",
    },
    {
        name: "Earphones",
        from: 1800,
        image: "/earphones.jpg",
    },
    {
        name: "Keyboards",
        from: 2000,
        image: "/keyboards.jpg",
    },
    {
        name: "Mouse",
        from: 1000,
        image: "/mouse.jpg",
    },
    {
        name: "Phone Case",
        from: 800,
        image: "/phone-case.jpg",
    },
    {
        name: "Smart Speaker",
        from: 3500,
        image: "/smart-speaker.jpg",
    },
    {
        name: "Smartwatch",
        from: 2500,
        image: "/smartwatch.jpg",
    },
    {
        name: "VR Headset",
        from: 5000,
        image: "/vr-headset.jpg",
    },
    {
        name: "Water Bottle",
        from: 1000,
        image: "/water-bottle.jpg",
    },
];

// Utility to remove duplicates by name
const uniqueProducts = featuredProducts.filter(
    (item, index, self) =>
        index === self.findIndex((p) => p.name.toLowerCase() === item.name.toLowerCase())
);

export default function Featured() {
    // Remove useState, use hover CSS for effect
    return (
        <div className="bg-gradient-to-br from-white via-gray-100 to-gray-200 py-20">
            <div className="mx-auto max-w-5xl px-4">
                <h4 className="text-center font-extrabold tracking-wide text-gray-800 mb-8 underline underline-offset-8 decoration-[#FF4500]">
                    Featured Products
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                    {uniqueProducts.map((product, idx) => (
                        <section
                            key={product.name}
                            className={`
                                group p-5 flex flex-col items-center bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-[1px] border-gray-100 hover:border-[#bcbcbc]
                            `}
                        >
                            <div className="relative w-28 h-28 mb-3 flex-shrink-0">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain rounded-xl shadow group-hover:scale-110 transition-transform duration-300"
                                    sizes="112px"
                                />
                                <div className="absolute -top-1 -right-1 bg-[#FF4500] px-2 py-1 text-xs text-white font-bold rounded tracking-widest shadow-lg group-hover:bg-[#d04000] transition-all">
                                    NEW
                                </div>
                            </div>

                            <div className="w-full text-center flex flex-col">
                                <h4 className="font-semibold mb-1 text-gray-800">{product.name}</h4>

                                <small className="text-gray-500 mb-2">
                                    From: <b className="">Ksh.{product.from}</b>
                                </small>

                                <button className="px-4 py-1 rounded-lg border border-[#bcbcbc] text-sm text-[#FF4500] font-semibold bg-white hover:bg-[#FF4500] hover:text-white transition-colors duration-200 cursor-pointer">
                                    View Details
                                </button>
                            </div>
                        </section>
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