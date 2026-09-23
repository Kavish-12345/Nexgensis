export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
  reviews?: Review[];
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

// The fields the add/edit form sends.
export interface ProductInput {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  thumbnail: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
