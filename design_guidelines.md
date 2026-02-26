# Design Guidelines: Sephora Product Page Mobile Replica

## Design Approach
**Reference-Based: Sephora E-commerce Pattern**
This is a faithful mobile recreation of Sephora's product detail page. Follow Sephora's established mobile e-commerce patterns precisely, including their visual hierarchy, spacing rhythms, and interaction patterns.

## Core Design Principles
- Clean, product-focused layout with minimal distractions
- High-quality product imagery takes visual priority
- Clear hierarchy: Product → Price → Actions → Details
- Accessibility through WCAG AA contrast ratios
- Generous tap targets (minimum 44px) for mobile interactions

## Typography System

**Primary Font**: Sans-serif system stack (Helvetica Neue, Arial, sans-serif)

**Hierarchy**:
- Brand name: 11px, uppercase, medium weight, letter-spacing: 1px
- Product title: 18px, regular weight, line-height: 1.3
- Price: 24px, bold weight
- Original value: 16px, regular, strikethrough
- Body text: 14px, regular, line-height: 1.5
- Section headers: 16px, semibold
- Micro-copy: 12px, regular

## Layout & Spacing

**Spacing Scale**: Use Tailwind units consistently
- Container padding: px-4 (16px horizontal)
- Section spacing: py-4 to py-6 (16-24px vertical)
- Component gaps: gap-3, gap-4 (12-16px)
- Tight groupings: gap-2 (8px)

**Grid System**:
- Single column layout throughout
- Image gallery: Horizontal scroll with snap points
- Thumbnails: 6-column grid with gaps

## Color Palette

**Core Colors**:
- Background: Pure white (#FFFFFF)
- Text primary: Black (#000000)
- Text secondary: Dark gray (#666666)
- Border/divider: Light gray (#E5E5E5)
- Link/action: Sephora black (#000000)

**Status Colors**:
- Out of stock: Medium gray background (#F5F5F5), dark gray text
- Sale badge: Red background (#CC0000), white text
- New badge: Black background, white text
- Rating stars: Gold (#D4AF37)

**Payment Logos**: Use actual logo images for Klarna (pink), Afterpay (mint), PayPal (blue)

## Component Library

### Header (Fixed Top)
- White background with bottom border
- Height: 60px
- Left: Hamburger menu icon
- Center: Sephora wordmark logo (black, ~100px width)
- Right: Search icon, account icon, basket icon (16px icons, 40px tap targets)

### Product Image Gallery
- Main image: Full-width, 1:1 aspect ratio
- Horizontal scroll: Smooth momentum scroll with snap
- Image counter overlay: Bottom-right, "1/7" format, white text on dark semi-transparent background
- Thumbnail strip: Below main image, 6 items visible, 8px gaps, 60px height

### Product Info Card
- Padding: p-4
- Brand link: Uppercase, underlined on tap
- Title: 2-line max with ellipsis
- Rating: Stars + count "(2)" + "Ask a question" link
- Loves count: Heart icon + "4.6K"

### Price Section
- Primary price: Extra bold, large
- Value comparison: Strikethrough, gray, smaller
- Payment options: "or 4 payments of $55.00 with" + logo strip
- Logo strip: Flex row, gap-2, 24px height logos

### Stock Status Button
- Full width
- Height: 48px
- "Out of Stock" state: Light gray background, medium gray text, cursor not-allowed
- Border-radius: 4px

### Sign In Banner
- Light gray background (#F7F7F7)
- Padding: p-4
- Text: "Sign in for FREE shipping"
- Links: Underlined "Sign in" and "create an account"

### Badges Section
- Horizontal scroll if needed
- Icon + label pairs
- Circular icons (32px), centered text below
- Gap: gap-4

### Expandable Sections
- Border-top dividers
- Header: Flex between, py-4, semibold text + chevron icon
- Collapsed by default (except first view)
- Expand animation: Smooth height transition
- Content: Nested with left padding, bulleted lists for ingredients

### Bottom Navigation (Fixed)
- White background, top border
- Height: 60px
- 4 icons evenly spaced: Home, Stores, Basket, Account
- Icon size: 24px
- Labels: 10px below icons

## Images

**Product Images** (Use these from Sephora CDN):
1. Main product image: Charlotte Tilbury advent calendar closed box (red/gold)
2. Image 2: Calendar open showing drawers
3. Video thumbnail with play icon overlay
4. Image 3-6: Product detail shots and contents
5. Thumbnail grid below gallery

**Icons Required**:
- Navigation: Menu, search, account, basket (simple line icons)
- Product: Heart (outline), star (filled for rating), play button
- Badges: Cruelty-free bunny, community heart, formulated-without icons
- Chevron down for expandable sections

**Payment Logos**: Klarna, Afterpay, PayPal (use actual SVG/PNG logos)

## Interactions

- Image gallery: Swipe left/right, momentum scroll, snap to image centers
- Thumbnails: Tap to jump to specific image
- Expandable sections: Smooth height animation (300ms ease)
- Links: Subtle opacity change on tap (0.7)
- Buttons: No hover states needed (mobile-only)

## Critical Mobile Patterns

- Sticky header on scroll
- Product images dominate initial viewport
- Progressive disclosure: Details hidden in expandable sections
- Fixed bottom navigation always accessible
- Horizontal scrolling for image gallery and badges
- All interactive elements: minimum 44px tap target