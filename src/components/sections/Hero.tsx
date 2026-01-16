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
        <div>
            <section className="container mx-auto p-8 pt-16 min-h-[70vh] flex flex-col gap-3 justify-center items-center">
                <h1 className="font-bold hidden sm:block">{content.title}</h1>
                <h3 className="font-medium text-center text-[#FF4500]">{content.subtitle}</h3>
                <p className="text-center w-[40vw] text-gray-500">
                    {content.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-5">
                    <Button btnLink="/shop" btnText={content.btnExplore} />
                    <Button btnLink="/about" btnText={content.btnAbout} />
                </div>
            </section>
        </div>
    )
}