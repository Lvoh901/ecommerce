"use client";
import Link from "next/link";
import Image from "next/image";

const categoriesData = [
  {
    name: "Backpacks",
    description: "Carry your essentials in style and comfort with durable, modern backpacks.",
    image: "/backpack.jpg",
    link: "/categories/backpacks",
  },
  {
    name: "Earphones",
    description: "Enjoy immersive sound on the go with high-quality, comfortable earphones.",
    image: "/earphones.jpg",
    link: "/categories/earphones",
  },
  {
    name: "Gaming Gear",
    description: "Elevate your gameplay with cutting-edge gaming accessories and gear.",
    image: "/gaming_gear.jpg",
    link: "/categories/gaming",
  },
  {
    name: "Wearables",
    description: "Track your fitness, health, and stay connected with smart wearables.",
    image: "/wearable.jpg",
    link: "/categories/wearables",
  },
  {
    name: "Computer Accessories",
    description: "Enhance your productivity with essential computer accessories.",
    image: "/computer_accessories.jpg",
    link: "/categories/computer-accessories",
  },
  {
    name: "Computers",
    description: "Find powerful and reliable computers for work, study, and play.",
    image: "/computers.jpg",
    link: "/categories/computers",
  },
  {
    name: "Monitors/TVs",
    description: "Find powerful and reliable computers for work, study, and play.",
    image: "/monitors.jpg",
    link: "/categories/monitors-tvs",
  },
  {
    name: "Phone Accessories",
    description: "Upgrade your mobile experience with versatile phone accessories.",
    image: "/phone_accessories.jpg",
    link: "/categories/phone-accessories",
  },
  {
    name: "Bluetooth Speakers",
    description: "Enjoy wireless, high-fidelity audio anywhere with Bluetooth speakers.",
    image: "/bluetooth_speakers.jpg",
    link: "/categories/speakers",
  },
  {
    name: "Drones",
    description: "Capture unique perspectives and explore the skies with advanced drones.",
    image: "/drone.jpg",
    link: "/categories/drones",
  },
  {
    name: "Cameras",
    description: "Snap stunning photos and videos with innovative cameras.",
    image: "/camera.jpg",
    link: "/categories/camera",
  },
  {
    name: "Furniture",
    description: "Modern furniture designs to complement your tech and living space.",
    image: "/furniture.jpg",
    link: "/categories/furniture",
  }
];

const Categories = () => {
  return (
    <div className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4">
        <div className="text-center mt-8">
          <h2 className="font-bold text-gray-900">Explore All Categories</h2>

          <p className="mt-4 text-gray-600">
            Discover a world of innovation. We&apos;ve curated the best tech products across various categories to help you find exactly what you need.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesData.map((category, index) => (
            <Link key={index} href={category.link} className="block group">
              <div className="relative h-68 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 flex flex-col justify-end">
                {/* Background Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
                  priority={index < 4}
                />


                <div className="absolute inset-0 bg-black/40 transition-all duration-300 group-hover:bg-opacity-50"></div>
                <div className="relative z-10 p-6">
                  <h3 className="font-bold text-white group-hover:text-blue-200">{category.name}</h3>
                  <p className="text-gray-200 leading-none font-light">{category.description}</p>
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
