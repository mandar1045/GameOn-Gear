export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'football' | 'basketball' | 'tennis' | 'swimming' | 'running' | 'fitness' | 'soccer' | 'baseball' | 'cricket' | 'golf' | 'hockey' | 'volleyball' | 'badminton' | 'boxing' | 'cycling' | 'martial-arts';
  sport: string;
  image: string;
  images?: string[];
  description: string;
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  brand: string;
  sizes?: string[];
  colors?: string[];
  specifications?: Record<string, string>;
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  sport: string;
  image: string;
  description: string;
  productCount: number;
}