import Button from "../ui/button";

export default function Hero() {
    return (
        <div>
            <section className="container mx-auto p-8 pt-16 min-h-[70vh] flex flex-col gap-3 justify-center items-center">
                <h1 className="text-center">High-quality gadgets & Accessories.</h1>
                <p className="text-center w-[40vw] text-gray-5s00">
                    Discover the latest technology trends, in-depth product reviews, and essential resources tailored to your needs.
                    Stay informed with up-to-date information on high-quality gadgets, accessories, and smart solutions designed to enhance your lifestyle.
                </p>

                <div className="flex flex-wrap gap-3 pt-5">
                    <Button btnLink="/" btnText="Explore" />
                    <Button btnLink="/" btnText="About Us" />
                </div>
            </section>
        </div>
    )
}