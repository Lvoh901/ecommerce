"use client";
import Link from "next/link";
import Image from "next/image";
import { HandHeart } from "lucide-react";

const categoriesData = [
  {
    name: "Phone Accessories",
    description: "Stay connected with the latest phones and essential accessories.",
    image: "/phone-case.jpg",
    link: "/categories/smartphones",
  },
  {
    name: "Computer Accessories",
    description: "Powerful machines for work, creativity, and everyday tasks.",
    image: "/keyboards.jpg",
    link: "/categories/laptops",
  },
  {
    name: "Gaming Gear",
    description: "Immersive experiences with high-performance gaming peripherals.",
    image: "/vr-headset.jpg",
    link: "/categories/gaming",
  },
  {
    name: "Audio & Wearables",
    description: "Immerse yourself in sound and track your fitness goals.",
    image: "/earphones.jpg",
    link: "/categories/audio-wearables",
  },
  {
    name: "Smart Home Devices",
    description: "Transform your living space into a connected, intelligent environment.",
    image: "/smart-speaker.jpg",
    link: "/categories/smart-home",
  },
  {
    name: "Drones",
    description: "Capture breathtaking moments from unique perspectives.",
    image: "/drone.jpeg",
    link: "/categories/drones",
  },
  {
    name: "Cameras",
    description: "Capture breathtaking moments from unique perspectives.",
    image: "/camera.jpg",
    link: "/categories/cameras",
  },
  {
    name: "Furniture",
    description: "Capture breathtaking moments from unique perspectives.",
    image: "/furniture.jpg",
    link: "/categories/furniture",
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
