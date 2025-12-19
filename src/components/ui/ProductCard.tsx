import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    rating: number;
  };
}

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

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={product.image}
          alt={product.name}
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="p-4">
        <p className="font-bold">{product.name}</p>

        <p className="text-gray-500">{product.category}</p>

        <div className="mt-2">
          <Rating rating={product.rating} />
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold">Ksh.{product.price}</span>
          <Link href={`/products/${product.id}`} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
