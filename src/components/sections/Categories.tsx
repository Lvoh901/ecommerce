"use client";
import Link from "next/link";
import Image from "next/image";

const categoriesData = [
  {
    name: "Smartphones & Accessories",
    description: "Stay connected with the latest phones and essential accessories.",
    image: "/phone-case.jpg", // Placeholder image
    link: "/categories/smartphones",
  },
  {
    name: "Laptops & Desktops",
    description: "Powerful machines for work, creativity, and everyday tasks.",
    image: "/keyboards.jpg", // Placeholder image
    link: "/categories/laptops",
  },
  {
    name: "Gaming Gear",
    description: "Immersive experiences with high-performance gaming peripherals.",
    image: "/vr-headset.jpg", // Placeholder image
    link: "/categories/gaming",
  },
  {
    name: "Audio & Wearables",
    description: "Immerse yourself in sound and track your fitness goals.",
    image: "/earphones.jpg", // Placeholder image
    link: "/categories/audio-wearables",
  },
  {
    name: "Smart Home Devices",
    description: "Transform your living space into a connected, intelligent environment.",
    image: "/smart-speaker.jpg", // Placeholder image
    link: "/categories/smart-home",
  },
  {
    name: "Drones & Cameras",
    description: "Capture breathtaking moments from unique perspectives.",
    image: "/backpack.jpg", // Placeholder image
    link: "/categories/drones-cameras",
  },
];

const Categories = () => {
  return (
    <div className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mt-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Explore Our Tech Categories
          </h2>
          <p className="mt-4 text-gray-600">
            Discover a world of innovation. We&apos;ve curated the best tech products across various categories to help you find exactly what you need.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesData.map((category, index) => (
            <Link key={index} href={category.link} className="block group">
              <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
                <Image
                  src={category.image}
                  alt={category.name}
                  className=""
                  width={140}
                  height={48}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-gray-600">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
