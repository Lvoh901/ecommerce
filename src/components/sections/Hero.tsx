import Button from "../ui/button";

export default function Hero() {
    return (
        <div>
            <section className="container mx-auto p-8 pt-16 min-h-[70vh] flex flex-col gap-3 justify-center items-center">
                <h1 className="font-bold hidden sm:block">KonnectTech</h1>
                <h3 className="font-medium text-center text-[#FF4500]">High-quality gadgets & Accessories.</h3>
                <p className="text-center w-[40vw] text-gray-500">
                    Discover the latest technology trends, in-depth product reviews, and essential resources tailored to your needs.
                    Stay informed with up-to-date information on high-quality gadgets, accessories, and smart solutions designed to enhance your lifestyle.
                </p>

                <div className="flex flex-wrap gap-2 pt-5">
                    <Button btnLink="/" btnText="Explore" />
                    <Button btnLink="/" btnText="About Us" />
                </div>
            </section>
        </div>
    )
}