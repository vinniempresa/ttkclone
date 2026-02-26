import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface ProductImage {
  url: string;
  alt: string;
  type: 'image' | 'video';
}

export interface IncludedProduct {
  size: string;
  name: string;
}

export interface Highlight {
  icon: string;
  label: string;
}

export interface Review {
  id: string;
  rating: number;
  author: string;
  date: string;
  title: string;
  content: string;
  verifiedPurchase: boolean;
  helpful: number;
  images?: string[];
}

export interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ProductCard {
  id: string;
  sku: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  priceRange?: string;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  badges?: string[];
  variantId?: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  itemNumber: string;
  sku: string;
  variantId?: string;
  brand: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  lovesCount: string;
  price: number;
  originalValue: number;
  priceRange?: string;
  installmentPrice: number;
  installmentCount: number;
  images: ProductImage[];
  badges: string[];
  highlights: Highlight[];
  description: string;
  includedProducts: IncludedProduct[];
  ingredients: { [key: string]: string };
  inStock: boolean;
  shippingOptions: {
    sameDayDelivery: boolean;
    pickup: boolean;
  };
  reviews: Review[];
  ratingDistribution: RatingDistribution;
  reviewImages: string[];
}
