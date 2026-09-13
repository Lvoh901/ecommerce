import { CheckCircle2 } from "lucide-react";

export default function WhyUs() {
  const highlights = [
    {
      title: "Personalized Recommendations",
      desc: "Instead of just listing endless products, we provide tailored picks just for you.",
      iconBg: "bg-[#ff4500]/10 border-[#ff4500]/30",
    },
    {
      title: "Serve Every Passion",
      desc: "Whether you're a gamer, professional, or fitness enthusiast, we've done the homework so you don’t have to.",
      iconBg: "bg-[#ffb020]/10 border-[#ffb020]/30",
    },
    {
      title: "Customer Sentiment Insights",
      desc: "Our pages offer in-depth summaries of what customers really think—highlighting the pros and cons that matter most.",
      iconBg: "bg-[#0ff]/10 border-[#0ff]/30",
    },
    {
      title: "Right Fit For You",
      desc: "We match you with products that truly fit your needs and passions, not just what's popular.",
      iconBg: "bg-[#50fa7b]/10 border-[#50fa7b]/30",
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* subtle gradient/orange highlight */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FF4500]/15 blur-[110px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#ffb020]/10 blur-[110px] rounded-full pointer-events-none z-0"></div>
      {/* End gradients */}

      <div className="max-w-5xl mx-auto relative z-10">
        <h3 className="font-bold text-gray-900 dark:text-white text-center mb-10 underline underline-offset-4 decoration-[#ff4500] tracking-wider font-['Orbitron']">
          What Makes Us Unique?
        </h3>
        <ul className="grid gap-8 md:grid-cols-2">
          {highlights.map((item, idx) => (
            <li
              key={idx}
              className="relative p-6 rounded-2xl bg-white/90 dark:bg-zinc-900/70 shadow-[0_8px_32px_-8px_rgba(255,69,0,0.15)] border border-zinc-200/60 dark:border-zinc-700/40 flex gap-4 items-start transition hover:scale-[1.025] hover:shadow-[0_12px_40px_-6px_rgba(255,69,0,0.20)] group"
            >
              <div
                className={`shrink-0 rounded-xl border w-12 h-12 flex items-center justify-center ${item.iconBg} shadow`}
              >
                <CheckCircle2 className="w-7 h-7 text-[#ff4500] group-hover:scale-110 transition" />
              </div>
              <div>
                <p className="font-semibold mb-1 text-[#ff4500] font-['Orbitron'] tracking-wide">
                  {item.title}
                </p>
                <span className="text-gray-700 dark:text-gray-200 font-medium text-sm">
                  {item.desc}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
