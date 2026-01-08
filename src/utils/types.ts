export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    subcategory: string;
    rating: number;
    reviews: number;
}

export interface FeaturedCategory {
    name: string;
    from: number;
    image: string;
    link: string;
}

export interface Category {
    id: string;
    name: string;
    image: string;
    link: string;
    minPrice?: number; // 'from' price
}
