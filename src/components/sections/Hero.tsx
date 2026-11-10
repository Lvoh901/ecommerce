import Button from "../ui/button";
import { ArrowRight, Truck, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";

interface HeroProps {
  content: {
    title: string;
    subtitle: string;
    description: string;
    btnExplore: string;
    btnAbout: string;
  };
}

export default function Hero({ content }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#05070f] shadow-[0_30px_80px_-40px_rgba(255,69,0,0.35)]">
      {/* Background image + layers */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/computers.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#05070f]/85 via-[#05070f]/75 to-[#05070f]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 tech-grid-dark animate-grid-pan opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 animate-drift rounded-full bg-[#FF4500]/25 blur-[110px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 h-[26rem] w-[26rem] animate-drift rounded-full bg-[#ffb020]/15 blur-[120px]" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 pb-12 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="max-w-3xl">
          <span className="eyebrow mb-5">Nairobi · Tech &amp; Repairs</span>

          <h1 className="text-white text-glow">{content.title}</h1>

          <h3 className="mt-3 font-semibold tracking-wide text-[#FF4500]">{content.subtitle}</h3>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
            {content.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button btnLink="/shop" btnText={content.btnExplore} />
            <Link
              href="/book-service"
              className="btn-ghost inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-white"
            >
              <Wrench className="h-4 w-4 text-[#FF4500]" />
              Book a repair
            </Link>
            {content.btnAbout && (
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 px-1 text-sm font-semibold text-gray-300 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {content.btnAbout}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          <dl className="mt-9 grid max-w-xl grid-cols-1 gap-3 xs:grid-cols-3">
            {[
              { icon: Truck, label: "Free delivery", value: "Within Nairobi" },
              { icon: ShieldCheck, label: "Quality checked", value: "Before dispatch" },
              { icon: Wrench, label: "Repairs", value: "In-store experts" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 backdrop-blur"
              >
                <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#FF4500]" />
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.label}</dt>
                  <dd className="text-xs font-semibold text-white">{item.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
