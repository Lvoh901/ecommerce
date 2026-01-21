"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@prisma/client';

interface ProductCardProps {
  product: Product;
}

const Rating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />);
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
  }
  return <div className="flex items-center">{stars}</div>;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full group">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2 flex flex-col">
          <span className="text-[#FF4500] font-bold uppercase tracking-wider">{product.name}</span>
          <small className="font-bold text-gray-800" title={product.name}>{product.category}</small>
          <p className="font-bold text-gray-900">Ksh.{product.price}</p>
        </div>

        <div className="mb-4">
          <Rating rating={product.rating || 0} />
        </div>

        <div className="mt-auto flex gap-3">
          <Link href={`/products/${product.id}`} className="flex-1 text-center bg-gray-100 text-gray-800 font-bold py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
            <small className='uppercase'>Details</small>
          </Link>

          <button
            onClick={() => addToCart(product)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#FF4500] text-white font-bold py-1.5 rounded-lg hover:bg-orange-700 transition-colors active:scale-95 transform"
          >
            <ShoppingCart className="w-5 h-5" />
            <small className='uppercase'>Add</small>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
