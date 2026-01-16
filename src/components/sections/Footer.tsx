import { prisma } from "@/lib/db";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default async function Footer() {
    const uiContent = await prisma.uIContent.findMany({
        where: {
            group: {
                in: ["footer", "contact", "social"]
            }
        }
    });

    const getContent = (key: string) => uiContent.find((c: any) => c.key === key)?.value || "";

    const socialLinks = [
        { icon: Facebook, href: getContent("social_facebook"), label: "Facebook" },
        { icon: Twitter, href: getContent("social_twitter"), label: "Twitter" },
        { icon: Instagram, href: getContent("social_instagram"), label: "Instagram" },
        { icon: Linkedin, href: getContent("social_linkedin"), label: "LinkedIn" },
    ].filter(s => s.href);

    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-20 rounded-t-[3rem]">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Brand Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white tracking-wider font-[var(--font-orbitron)]">
                        Konnect<span className="text-blue-500">Tech</span>
                    </h2>
                    <p className="text-gray-400 leading-relaxed max-w-xs">
                        {getContent("footer_description") || "Your one-stop shop for premium gadgets and accessories. Experience the future of tech shopping."}
                    </p>
                    <div className="flex space-x-4">
                        {socialLinks.map((social, idx) => (
                            <Link 
                                key={idx} 
                                href={social.href} 
                                target="_blank" 
                                className="hover:text-blue-500 transition-colors bg-gray-800 p-2 rounded-lg"
                                aria-label={social.label}
                            >
                                <social.icon size={20} />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">Quick Links</h3>
                    <ul className="space-y-4">
                        <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                        <li><Link href="/shop" className="hover:text-blue-400 transition-colors">Shop All</Link></li>
                        <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                        <li><Link href="/cart" className="hover:text-blue-400 transition-colors">My Cart</Link></li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">Popular Categories</h3>
                    <ul className="space-y-4">
                        <li><Link href="/shop?category=Computers" className="hover:text-blue-400 transition-colors">Computers</Link></li>
                        <li><Link href="/shop?category=Wearables" className="hover:text-blue-400 transition-colors">Wearables</Link></li>
                        <li><Link href="/shop?category=Gaming Gear" className="hover:text-blue-400 transition-colors">Gaming Gear</Link></li>
                        <li><Link href="/shop?category=Cameras" className="hover:text-blue-400 transition-colors">Cameras</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">Contact Us</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center space-x-3">
                            <MapPin size={18} className="text-blue-500 shrink-0" />
                            <span>{getContent("contact_address") || "Nairobi, Kenya"}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Phone size={18} className="text-blue-500 shrink-0" />
                            <span>{getContent("contact_phone") || "+254 700 000000"}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Mail size={18} className="text-blue-500 shrink-0" />
                            <Link href={`mailto:${getContent("contact_email")}`} className="hover:text-blue-400 transition-colors">
                                {getContent("contact_email") || "hello@konnecttech.com"}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-800 mt-16 pt-8 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} KonnectTech. All rights reserved.</p>
                <div className="mt-2 space-x-4">
                    <Link href="#" className="hover:text-gray-300">Privacy Policy</Link>
                    <Link href="#" className="hover:text-gray-300">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}