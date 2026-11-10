import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Wrench,
  Truck,
  ShieldCheck,
} from "lucide-react";

export default async function Footer() {
  const [uiContent, products] = await Promise.all([
    prisma.uIContent.findMany({
      where: {
        group: {
          in: ["footer", "contact", "social"],
        },
      },
    }),
    prisma.product.findMany({ select: { category: true } }),
  ]);

  const getContent = (key: string) =>
    uiContent.find((c) => c.key === key)?.value || "";

  const categories = Array.from(new Set(products.map((p) => p.category)))
    .sort()
    .slice(0, 6);

  const socialLinks = [
    { icon: Facebook, href: getContent("social_facebook"), label: "Facebook" },
    { icon: Twitter, href: getContent("social_twitter"), label: "Twitter" },
    {
      icon: Instagram,
      href: getContent("social_instagram"),
      label: "Instagram",
    },
    { icon: Linkedin, href: getContent("social_linkedin"), label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <footer className="relative mt-14 overflow-hidden rounded-t-[2rem] border-t border-white/10 bg-[#05070f] px-4 pb-10 pt-12 text-gray-300 sm:px-6 sm:pt-16 lg:px-8">
      <div className="absolute inset-x-0 top-0 hairline"></div>
      <div className="pointer-events-none absolute inset-0 tech-grid-dark opacity-60"></div>
      <div className="pointer-events-none absolute -top-24 left-1/3 h-64 w-96 rounded-full bg-[#FF4500]/15 blur-[110px]"></div>

      <div className="relative mx-auto max-w-7xl">
        {/* Promise strip */}
        <div className="mb-10 grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-3">
          {[
            { icon: Truck, title: "Free Nairobi delivery", copy: "Same-day within the CBD" },
            { icon: ShieldCheck, title: "Verified quality", copy: "Every gadget checked in-store" },
            { icon: Wrench, title: "Repair support", copy: "Expert fixes for what you own" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FF4500]/15 text-[#FF4500]">
                <item.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">{item.title}</p>
                <p className="text-xs text-gray-400">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 space-y-5 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="KonnectTech home">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF4500] text-lg font-extrabold text-white">
                K
              </span>
              <span className="font-['Orbitron'] text-sm font-extrabold tracking-widest text-white">
                KONNECT<span className="text-brand">TECH</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-gray-400">
              {getContent("footer_description") ||
                "Your one-stop shop for premium gadgets and accessories. Experience the future of tech shopping."}
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/5 p-2 text-gray-400 transition-colors hover:bg-[#FF4500]/15 hover:text-[#FF4500]"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Shop by category */}
          <div>
            <h5 className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-white">Shop</h5>
            <ul className="space-y-2.5 text-sm">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/shop?category=${encodeURIComponent(category)}`}
                    className="text-gray-400 transition-colors hover:text-[#FF4500]"
                  >
                    {category}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="font-bold text-white transition-colors hover:text-[#FF4500]">
                  All products &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-white">Company</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 transition-colors hover:text-[#FF4500]">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/book-service" className="text-gray-400 transition-colors hover:text-[#FF4500]">
                  Book a repair
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 transition-colors hover:text-[#FF4500]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 transition-colors hover:text-[#FF4500]">
                  My cart
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-400 transition-colors hover:text-[#FF4500]">
                  Track an order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h5 className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-white">Contact</h5>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#FF4500]" />
                <span className="text-gray-400">
                  {getContent("contact_address") || "Tech Plaza, Nairobi, Kenya"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-[#FF4500]" />
                <a
                  href={`tel:${getContent("contact_phone")}`}
                  className="text-gray-400 transition-colors hover:text-[#FF4500]"
                >
                  {getContent("contact_phone") || "+254 712 345 678"}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-[#FF4500]" />
                <a
                  href={`mailto:${getContent("contact_email")}`}
                  className="break-all text-gray-400 transition-colors hover:text-[#FF4500]"
                >
                  {getContent("contact_email") || "support@konnecttech.com"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} KonnectTech. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="transition-colors hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-gray-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
