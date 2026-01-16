import Link from "next/link";
import Image from "next/image";
import { Category } from "@prisma/client";

interface CategoriesProps {
    categories: Category[];
}

const Categories = ({ categories }: CategoriesProps) => {
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
          {categories.map((category, index) => (
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
                  <h5 className="font-bold text-white group-hover:text-blue-200">{category.name}</h5>
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
