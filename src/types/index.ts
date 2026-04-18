// src/types/index.ts

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  type: "veg" | "non-veg" | "egg";
  isBestseller: boolean;
  isSpicy: boolean;
  inStock: boolean;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export interface Offer {
  id: string;
  text: string;
  isActive: boolean;
  order: number;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface Order {
  id?: string;
  items: CartItem[];
  total: number;
  customerName?: string;
  customerAddress?: string;
  paymentMode?: string;
  timestamp: Date | string;
  status: "pending" | "confirmed" | "delivered";
}

export interface SiteSettings {
  whatsappNumber: string;
  instagramUrl: string;
  address: string;
  kitchenTiming: string;
  deliveryTiming: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  review: string;
  foodPhoto?: string;
}
