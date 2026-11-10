import Link from "next/link";
import { ArrowRight, Cpu, HeartHandshake, Sparkles } from "lucide-react";

const POINTS = [
  {
    icon: Sparkles,
    title: "Curated, not endless",
    copy: "Personalized picks instead of a wall of listings you have to filter through.",
  },
  {
    icon: Cpu,
    title: "Specs that make sense",
    copy: "Clear comparisons and customer sentiment summaries so you can decide quickly.",
  },
  {
    icon: HeartHandshake,
    title: "Support after the sale",
    copy: "In-store repairs and honest advice long after the box is opened.",
  },
];

export default function About() {
  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-60" />
      <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-[#FF4500]/10 blur-[90px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <div>
          <span className="eyebrow mb-4">About KonnectTech</span>
          <h2 className="font-extrabold text-gray-900">
            Your trusted source for tech, <span className="text-brand">tailored to you.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
            Instead of just listing endless products, we provide personalized recommendations. Whether
            you&apos;re a gamer looking for the perfect headset, a professional seeking a productivity-boosting
            keyboard, or a fitness enthusiast in search of the latest smartwatch, we&apos;ve done the homework
            for you.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
            Our product pages include in-depth summaries of customer sentiment, highlighting the pros and cons
            that matter most — so you end up with gear that fits your needs, not just what&apos;s trending.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
            >
              Browse the catalog <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/book-service"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-800 transition-colors hover:border-[#FF4500]/50 hover:text-[#FF4500]"
            >
              Book a repair
            </Link>
          </div>
        </div>

        <ul className="grid gap-3">
          {POINTS.map((point) => (
            <li
              key={point.title}
              className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-[0_16px_40px_-34px_rgba(2,6,23,0.6)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF4500]/25 bg-[#FF4500]/10 text-[#FF4500]">
                <point.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-['Orbitron'] text-sm font-bold tracking-wide text-gray-900">{point.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{point.copy}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
