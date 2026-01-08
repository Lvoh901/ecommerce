"use client";
import { useParams } from "next/navigation";
import { products } from "@/data";
import { useCart } from "@/context/CartContext";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import Image from "next/image";
import { Star } from "lucide-react";

const Rating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />);
    } else {
      stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
    }
  }
  return <div className="flex items-center">{stars}</div>;
};

export default function ProductPage() {
  const { addToCart } = useCart();
  const params = useParams();
  const id = params.id as string;
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-5 pt-5">
            <div>
              <Image
                width={300}
                height={300}
                src={product.image}
                alt={product.name}
                className="rounded-md"
              />
            </div>

            <div>
              <h3 className="font-bold mb-2">{product.name}</h3>

              <div className="flex items-center mb-4">
                <Rating rating={product.rating} />
                <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
              </div>

              <p className="text-gray-600 mb-4">{product.description}</p>

              <p className="font-bold mb-4">${product.price}</p>

              <button
                onClick={() => product && addToCart(product)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <p className='uppercase'>Add to Cart</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
