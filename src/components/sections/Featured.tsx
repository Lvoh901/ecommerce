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
        name: "Computer Accessories",
        from: 2000,
        image: "/computer_accessories.jpg",
    },
    {
        name: "Phone Accessories",
        from: 800,
        image: "/phone_accessories.jpg",
    },
    {
        name: "Bluetooth Speakers",
        from: 3500,
        image: "/bluetooth_speakers.jpg",
    },
    {
        name: "Wearables",
        from: 2500,
        image: "/wearable.jpg",
    },
    {
        name: "Gaming Gear",
        from: 5000,
        image: "/gaming_gear.jpg",
    },
    {
        name: "Water Bottle",
        from: 1000,
        image: "/water_bottle.jpg",
    },
    {
        name: "Drones",
        from: 5000,
        image: "/drone.jpg",
    },
    {
        name: "Cameras",
        from: 1000,
        image: "/camera.jpg",
    },
    {
        name: "Furniture",
        from: 1000,
        image: "/furniture.jpg",
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
            <div className="mx-auto max-w-7xl px-4">
                <h4 className="text-center font-extrabold tracking-wide text-gray-800 mb-8 underline underline-offset-8 decoration-[#FF4500]">
                    Featured Products
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {uniqueProducts.map((product, idx) => (
                        <section
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
                                <div className="absolute inset-0 bg-black opacity-40"></div>
                            </div>
                            {/* Card Content */}
                            <div className="relative z-10 w-full flex flex-col items-center text-center p-6">
                                <h4 className="font-semibold mb-1 text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.60)]">{product.name}</h4>

                                <small className="text-gray-200 mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                                    From: <b className="">Ksh.{product.from}</b>
                                </small>

                                <button className="px-4 py-1 rounded-lg border border-white text-sm text-[#FF4500] font-semibold bg-white bg-opacity-80 hover:bg-[#FF4500] hover:text-white transition-colors duration-200 cursor-pointer shadow">
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