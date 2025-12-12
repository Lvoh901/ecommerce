"use client";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  return (
    <div>
      <Navigation />
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl capitalize">
            {slug.replace(/-/g, ' ')}
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Explore our curated selection of {slug.replace(/-/g, ' ')} products.
          </p>
          {/* Further content and product listings will go here */}
          <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800">Products coming soon!</h2>
            <p className="mt-2 text-gray-600">
              We are busy hand-picking the best {slug.replace(/-/g, ' ')} items based on market reviews and customer interests.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
