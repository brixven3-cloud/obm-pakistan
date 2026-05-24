// Shared TypeScript types used across the application
// These mirror the Mongoose interfaces but are plain objects (no Document overhead)

export type UserRole = 'client' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'blocked';
export type BusinessType = 'mobile' | 'property' | 'laptop' | 'cloth' | 'perfume' | 'other';
export type ThemeKey = 'blue' | 'green' | 'darkGold' | 'pink' | 'teal' | 'coral';
export type OrderStatus = 'new' | 'seen' | 'fulfilled';

export interface StoreSection {
  header: { logo?: string; announcement?: string };
  hero: { headline: string; subheadline?: string; imageUrl?: string };
  about: { title?: string; body?: string; imageUrl?: string };
}

export interface PublicStore {
  _id: string;
  slug: string;
  name: string;
  tagline?: string;
  whatsappNumber: string;
  businessType: BusinessType;
  theme: ThemeKey;
  sections: StoreSection;
  isActive: boolean;
}

export interface PublicProduct {
  _id: string;
  title: string;
  description?: string;
  price: number;
  images: string[];
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  qty: number;
  image?: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
}

// Pagination helpers
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
