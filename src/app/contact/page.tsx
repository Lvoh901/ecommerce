import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import {
  Clock,
  Mail,
  MapPin,
  Phone,
  PackageSearch,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import ContactForm from "@/components/ui/ContactForm";

const CHANNELS = [
  {
    icon: MapPin,
    label: "Visit the store",
    value: "Tech Plaza, Nairobi, Kenya",
    href: "https://maps.google.com/?q=Tech+Plaza+Nairobi",
  },
  {
    icon: Phone,
    label: "Call or WhatsApp",
    value: "+254 712 345 678",
    href: "tel:+254712345678",
  },
  {
    icon: Mail,
    label: "Email support",
    value: "support@konnecttech.com",
    href: "mailto:support@konnecttech.com",
  },
  {
    icon: Clock,
    label: "Opening hours",
    value: "Mon–Sat · 9:00–18:00",
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navigation />

      <main className="flex-grow px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          <div className="mb-8 max-w-2xl sm:mb-10">
            <span className="eyebrow mb-3">Support</span>
            <h2 className="text-gray-900">Get in touch</h2>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Questions about a product, an order, or a repair? Send us a
              message and the KonnectTech team will get back to you — usually
              the same working day.
            </p>

            {/* Channels */}
            <div className="space-y-5 mt-4">
              <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
                {CHANNELS.map((channel) => {
                  const body = (
                    <>
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF4500]/10 text-[#FF4500]">
                        <channel.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gray-500">
                          {channel.label}
                        </p>
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {channel.value}
                        </p>
                      </div>
                    </>
                  );

                  return channel.href ? (
                    <a
                      key={channel.label}
                      href={channel.href}
                      target={
                        channel.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#FF4500]/40"
                    >
                      {body}
                    </a>
                  ) : (
                    <div
                      key={channel.label}
                      className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4"
                    >
                      {body}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
                <Link
                  href="/book-service"
                  className="group rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#FF4500]/40"
                >
                  <Wrench className="mb-2 h-5 w-5 text-[#FF4500]" />
                  <p className="text-sm font-bold text-gray-900">
                    Book a repair
                  </p>
                  <p className="text-xs text-gray-500">
                    Same-day diagnostics in-store.
                  </p>
                </Link>
                <Link
                  href="/orders"
                  className="group rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#FF4500]/40"
                >
                  <PackageSearch className="mb-2 h-5 w-5 text-[#FF4500]" />
                  <p className="text-sm font-bold text-gray-900">
                    Track an order
                  </p>
                  <p className="text-xs text-gray-500">
                    See status and delivery details.
                  </p>
                </Link>
              </div>

              <div className="rounded-2xl border border-[#FF4500]/20 bg-[#FF4500]/5 p-5">
                <p className="text-sm font-bold text-gray-900">
                  Shopping for a team?
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Tell us the devices and quantities you need and we&apos;ll put
                  together a quote.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(2,6,23,0.35)] sm:p-8">
            <h2 className="mb-1 text-xl text-gray-900">Send a message</h2>
            <p className="mb-6 text-sm text-gray-500">
              All fields are required.
            </p>
            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
