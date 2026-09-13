import Button from "../ui/button";

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
    <div className="">
      <section
        className="relative p-8 pt-16 min-h-[95vh] flex flex-col gap-4 justify-center items-center rounded-3xl overflow-hidden bg-cover bg-center shadow-[0_30px_80px_-20px_rgba(255,69,0,0.35)] border border-white/10"
        style={{ backgroundImage: "url('/computers.jpg')" }}
      >
        {/* 40% Opacity Overlay */}
        <div className="absolute inset-0 bg-[#05070f]/70 z-0 pointer-events-none"></div>
        {/* Blueprint grid + ember/circuit orbs */}
        <div className="absolute inset-0 tech-grid-dark animate-grid-pan opacity-60 z-0 pointer-events-none"></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#FF4500]/25 blur-[110px] animate-drift z-0 pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-16 w-[28rem] h-[28rem] rounded-full bg-[#ffb020]/15 blur-[120px] animate-drift z-0 pointer-events-none"></div>

        {/* Content wrapper to stay above the overlay */}
        <div className="relative z-10 flex flex-col items-center gap-4 container mx-auto px-4 sm:px-6 lg:px-8 leading-6">
          <h1 className="font-bold hidden sm:block text-white tracking-wider font-['Orbitron'] text-glow text-center">
            {content.title}
          </h1>
          <h3 className="font-medium text-center tracking-wide text-brand">
            {content.subtitle}
          </h3>
          <p className="text-center w-full max-w-2xl text-white leading-relaxed text-lg">
            {content.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-6">
            <Button btnLink="/shop" btnText={content.btnExplore} />
            <Button btnLink="/about" btnText={content.btnAbout} />
          </div>
        </div>
      </section>
    </div>
  );
}
