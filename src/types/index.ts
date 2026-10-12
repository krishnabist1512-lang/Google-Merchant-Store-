export type CategoryId = 'apparel' | 'accessories' | 'drinkware' | 'stationery' | 'tech' | 'collectibles';

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  comment: string;
  helpfulCount: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number; // in USD
  compareAtPrice?: number;
  category: CategoryId;
  subcategory?: string;
  description?: string;
  specs?: string[];
  rating?: number;
  reviewCount?: number;
  images: string[];
  productUrl?: string;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  stock?: number;
  tags?: string[];
  flags?: {
    bestSeller?: boolean;
    trending?: boolean;
    new?: boolean;
    limited?: boolean;
    sale?: boolean;
  };
  reviews?: ProductReview[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  unitPrice: number;
  addedAt: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'upi' | 'card' | 'cod' | 'netbanking' | 'wallet';
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  estimatedDelivery: string;
}

export interface GAEventLog {
  id: string;
  timestamp: string;
  eventName: string;
  params: Record<string, any>;
}

export type Currency = 'INR' | 'USD';
