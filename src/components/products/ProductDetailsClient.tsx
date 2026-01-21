"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Star } from "lucide-react";
import { Product } from "@prisma/client";

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

export default function ProductDetailsClient({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
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

            <div className="flex flex-col mb-2 space-y-2.5">
              <Rating rating={product.rating} />
              <span className="ml-2 font-medium">({product.reviews} reviews)</span>
            </div>

            <p className="text-gray-600 mb-4">{product.description}</p>

            <p className="font-bold mb-4">${product.price}</p>

            <button
              onClick={() => addToCart(product)}
              className="bg-[#FF4500] text-white px-6 py-2 rounded-lg hover:font-bold transition-colors cursor-pointer"
            >
              <span className='uppercase'>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
