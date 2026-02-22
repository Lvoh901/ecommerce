import Button from "../ui/button";

interface HeroProps {
    content: {
        title: string;
        subtitle: string;
        description: string;
        btnExplore: string;
        btnAbout: string;
    }
}

export default function Hero({ content }: HeroProps) {
    return (
        <div className="">
            <section
                className="relative p-8 pt-16 min-h-[80vh] flex flex-col gap-4 justify-center items-center rounded-3xl overflow-hidden bg-cover bg-center shadow-2xl"
                style={{ backgroundImage: "url('/computers.jpg')" }}
            >
                {/* 40% Opacity Overlay */}
                <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none"></div>

                {/* Content wrapper to stay above the overlay */}
                <div className="relative z-10 flex flex-col items-center gap-4 container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-bold hidden sm:block text-white text-5xl md:text-6xl tracking-wider font-['Orbitron']">
                        {content.title}
                    </h1>
                    <h3 className="font-medium text-center text-[#FF4500] text-xl md:text-2xl tracking-wide">
                        {content.subtitle}
                    </h3>
                    <p className="text-center w-full max-w-2xl text-gray-200 leading-relaxed text-lg">
                        {content.description}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-6">
                        <Button btnLink="/shop" btnText={content.btnExplore} />
                        <Button btnLink="/about" btnText={content.btnAbout} />
                    </div>
                </div>
            </section>
        </div>
    )
}