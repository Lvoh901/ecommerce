import { CircleCheck } from "lucide-react";
import Image from "next/image";

export default function CTA() {
    return (
        <div className="bg-gray-800 py-20 text-white container mx-auto p-16 m-8 rounded-[3em] grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <section>
                <h1 className="">Subscribe to our email newsletter and get 10% off</h1>

                <form className="py-8 flex gap-2 items-center w-full max-w-md">
                    <input
                        type="email"
                        placeholder="Enter your Email"
                        className="flex-1 outline-none bg-transparent border-0 border-b-2 border-gray-400 py-3 px-2 text-white placeholder-gray-400 focus:border-[#FF4500] focus:ring-0 transition-colors duration-200"
                    />
                    <button
                        type="submit"
                        className="text-white bg-[#FF4500] px-6 py-3 rounded-r-lg font-semibold hover:bg-[#d04000] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2"
                    >
                        SUBMIT
                    </button>
                </form>

                <p className="flex items-center gap-2 mt-3"><CircleCheck className="text-[#FF4500]" /> Join the 10,000 users in our newsletter</p>
            </section>

            <div className="flex justify-end">
                <Image src="/cta.png" alt="CTA1" width={600} height={600} />
            </div>
        </div>
    )
}