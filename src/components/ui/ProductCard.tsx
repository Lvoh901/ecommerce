"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@prisma/client';

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
    <div className="card-lift bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full group">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
        <span className="absolute top-3 left-3 text-[11px] font-extrabold uppercase tracking-widest text-white glass-dark border border-white/20 px-2.5 py-1 rounded-full">{product.category}</span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2 flex flex-col">
          <span className="font-bold text-gray-900 tracking-wide">{product.name}</span>
          <p className="font-extrabold text-lg text-brand">Ksh.{product.price}</p>
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
            className="btn-primary flex-1 flex items-center justify-center gap-2 text-white font-bold py-1.5 rounded-lg active:scale-95 transform"
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
