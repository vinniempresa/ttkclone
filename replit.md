# TikTok Shop E-Commerce Store

## Overview
This project is a mobile-first e-commerce store branded as TikTok Shop, featuring a multi-product homepage with 24+ products and individual product detail pages. The site uses Shopify integration with checkout configured for Brazil (BRL currency, Portuguese language).

## User Preferences
The user prefers iterative development.
- Language: Brazilian Portuguese only (pt-BR)
- Currency: Brazilian Real (BRL) only
- Branding: TikTok Shop (black + #FF2A52)
- Font: TikTokFont (Regular, Semibold, Bold woff2)

## Recent Changes (February 2026)
- **TikTok Shop Rebranding**: Full rebrand from Sephora to TikTok Shop
- **Brand Colors**: Black (#000) and TikTok Red (#FF2A52) throughout
- **TikTok Font**: Custom TikTokFont (Regular 400, Semibold 600, Bold 700)
- **TikTok Logo**: Custom logo from attached assets
- **Single Language**: Brazilian Portuguese (pt-BR) only
- **Single Currency**: Brazilian Real (BRL) only
- **GhostsPay PIX Integration**: Payment via PIX for shipping fee (R$19,80)
- **Facebook Pixel**: ID 1393740129217356, fires Purchase event on first payment confirmation
- **Microsoft Clarity**: ID vkjcjb74i7 for session recording/heatmaps
- **Checkout Flow**: Cart → Checkout (address/contact) → PIX Payment page with QR code + countdown
- **Payment Page**: 10-minute countdown, QR code, copy-paste PIX code, auto-check payment status

## Previous Changes (November 2025)
- **Multi-Product Homepage**: 24+ products with category sections
- **Product Categories**: Bestsellers, New Arrivals, On Sale, All Products
- **Dynamic Product Pages**: Products accessed via `/product/:id` route
- **Updated API Routes**: `/api/products` (all products), `/api/products/:id` (single product)

## System Architecture

### Routing Structure
- `/` - Homepage with product grid (Bestsellers, New Arrivals, On Sale, All Products)
- `/product/:id` - Product detail page
- `/checkout` - Checkout page

### API Endpoints
- `GET /api/products` - Returns all ProductCard objects for homepage
- `GET /api/products/:id` - Returns full Product object by ID
- `GET /api/geolocation` - Returns user location based on IP (server-side cached)

### UI/UX Decisions
- **Mobile-First Design**: Optimized for 430px max-width mobile viewport
- **Color Scheme**: TikTok Shop branding (#000 black, #FF2A52 TikTok Red for accents/buttons/prices/stars, #666 gray, #E5E5E5 border)
- **Hero Banner**: TikTok Shop promotional banner with black-to-red gradient
- **Product Cards**: Show brand, name, rating, price with badges (New, Sale, Bestseller, etc.)
- **Horizontal Scroll**: Bestsellers, New Arrivals, On Sale sections scroll horizontally
- **Product Grid**: All Products section displays in 2-column grid

### Technical Implementations
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Shadcn UI
- **State Management**: TanStack Query for data fetching and caching
- **Routing**: Wouter for client-side navigation
- **Backend**: Express.js with in-memory storage
- **Product Data**: 24+ beauty products with real images, prices, SKUs

### Data Models

#### ProductCard (Homepage)
```typescript
interface ProductCard {
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
```

#### Product (Detail Page)
```typescript
interface Product {
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
  shippingOptions: { sameDayDelivery: boolean; pickup: boolean };
  reviews: Review[];
  ratingDistribution: RatingDistribution;
  reviewImages: string[];
}
```

### Feature Specifications
- **Homepage**: Product grid with category sections and hero banner
- **ProductPage**: Full product details with images, reviews, add to bag
- **PromoBanner**: TikTok Red (#FF2A52) promotional banner
- **MobileHeader**: Sticky header with TikTok Shop logo and navigation icons
- **BottomNavigation**: Countdown timer with "Add to Bag" button (TikTok Red)
- **CartModal**: Modal for quantity selection and checkout
- **Language**: Fixed to Brazilian Portuguese (pt-BR)
- **Currency**: Fixed to Brazilian Real (BRL)

### Shopify Integration
- Cart permalinks: `/cart/{variantId}:{qty}?checkout[shipping_address][country]=BR`
- Always uses pt-BR locale and BRL currency

## External Dependencies
- **Sephora CDN**: Product images from sephora.com

## File Structure
```
client/src/
├── App.tsx              # Main app with routing
├── pages/
│   ├── HomePage.tsx     # Multi-product homepage
│   ├── ProductPage.tsx  # Product detail page
│   ├── CheckoutPage.tsx # Checkout page
│   └── not-found.tsx    # 404 page
├── components/          # Reusable UI components
├── contexts/
│   ├── CurrencyContext.tsx    # Currency conversion
│   └── TranslationContext.tsx # Translation system
└── lib/
    ├── currency.ts      # Currency utilities
    ├── translations.ts  # Translation strings
    ├── geolocation.ts   # Geolocation service
    └── shopify.ts       # Shopify integration

server/
├── routes.ts            # API routes
├── storage.ts           # In-memory product storage
└── index.ts             # Express server

shared/
└── schema.ts            # TypeScript interfaces
```
