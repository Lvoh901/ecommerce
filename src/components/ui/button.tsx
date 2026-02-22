"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type ButtonProps = {
    btnLink: string;
    btnText: string;
};

export default function Button({ btnLink, btnText }: ButtonProps) {
    return (
        <Link
            href={btnLink}
            className="bg-[#FF4500] rounded-md text-white px-6 py-1.5 inline-block hover:text-white tracking-wider"
        >
            <motion.p
                whileHover={{ scale: 1.05, boxShadow: "0 3px 15px rgba(0,0,0,0.08)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                style={{ display: "inline-block" }}
            >
                {btnText}
            </motion.p>
        </Link>
    );
}