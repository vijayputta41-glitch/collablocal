# CollabLocal - Setup Guide

## Project Overview
CollabLocal is a hyper-local influencer marketplace connecting small local brands with nano/micro creators in Indian cities. This is a fully-built Next.js 14 (App Router) application with TypeScript, Tailwind CSS, NextAuth.js, Prisma, and PostgreSQL.

## Tech Stack
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS, lucide-react icons
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom brand colors and animations
- **No UI Library**: Pure HTML + Tailwind CSS (no shadcn/ui)

## Brand Colors
- Deep Navy: `#1A1A2E`
- Coral Accent: `#E94560`
- Blue Accent: `#0F3460`
- Clean Whites: `#ffffff`, `#f8f9fa`

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/collablocal"

# NextAuth
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Setup Database
```bash
# Create PostgreSQL database
createdb collablocal

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

### `/src/app`
- **`page.tsx`** - Beautiful landing page with hero, benefits, trust section, and footer
- **`layout.tsx`** - Root layout with SessionProvider wrapper
- **`globals.css`** - Tailwind directives, custom animations, and utility classes
- **`login/page.tsx`** - Google OAuth login page
- **`onboarding/page.tsx`** - Role selection (Creator/Brand)
- **`onboarding/creator/page.tsx`** - Creator profile creation form
- **`onboarding/brand/page.tsx`** - Brand profile creation form
- **`dashboard/layout.tsx`** - Dashboard layout with sidebar navigation
- **`dashboard/page.tsx`** - Dashboard home with stats and quick actions
- **`campaigns/page.tsx`** - Campaign listing with filters
- **`campaigns/new/page.tsx`** - Create new campaign form (brands only)
- **`creator/[id]/page.tsx`** - Public creator profile page
- **`brand/[id]/page.tsx`** - Public brand profile page

### `/src/app/api`
- **`auth/[...nextauth]/route.ts`** - NextAuth configuration and Google OAuth
- **`onboarding/route.ts`** - POST endpoint for profile creation
- **`campaigns/route.ts`** - GET campaigns, POST new campaigns

### `/src/components`
- **`providers.tsx`** - SessionProvider wrapper for client-side session

### `/src/lib`
- **`db.ts`** - Prisma Client singleton
- **`auth.ts`** - Auth configuration export
- **`constants.ts`** - Cities, niches, brand categories, content types
- **`types.ts`** - TypeScript interfaces

## Key Features Implemented

### 1. Authentication
- Google OAuth via NextAuth.js
- Session management with user role tracking
- Protected dashboard routes

### 2. User Onboarding
- Two-step onboarding (role selection → profile creation)
- Creator profile with Instagram, niches, rates, stats, portfolio
- Brand profile with category, location, description, GST number
- Form validation and loading states

### 3. Dashboard
- Role-based navigation (Creator vs Brand)
- Stats cards showing deals, earnings, ratings
- Quick action buttons for relevant features
- Mobile-responsive sidebar with hamburger menu

### 4. Campaigns
- Campaign listing with city and niche filters
- Campaign creation for brands with budget and deadline
- Creator profiles with ratings and portfolio
- Brand profiles with campaign history

### 5. Design System
- Consistent brand colors throughout
- Smooth animations (fade-in, slide-in, count-up)
- Responsive grid layouts (mobile-first)
- Custom button utilities (primary, secondary, outline)
- Badge utilities with color variants
- Card hover effects with shadows

## Styling Guide

### Custom Classes Available
```css
/* Buttons */
.btn-primary      /* Coral background, white text */
.btn-secondary    /* Navy border, navy text */
.btn-outline      /* Gray border, gray text */

/* Cards */
.card             /* White background with shadow */

/* Badges */
.badge            /* Light gray background */
.badge-coral      /* Light coral background */
.badge-blue       /* Light blue background */

/* Inputs */
.input-field      /* Styled input/textarea */

/* Gradients */
.gradient-coral-blue   /* Coral to blue gradient */
.gradient-navy         /* Navy gradient */

/* Animations */
.animate-fade-in-up
.animate-slide-in-left
.animate-slide-in-right
.animate-pulse-glow
.animate-count-up
```

## Database Schema (Prisma)

### User
- id, email, name, image
- role (creator/brand)
- onboardingCompleted

### CreatorProfile
- displayName, instagramHandle, city
- niches (JSON array)
- followerCount, engagementRate
- minRate, maxRate
- bio, portfolioUrls
- rating, totalDeals, isVerified

### BrandProfile
- businessName, category, city
- gstNumber, website, instagramHandle
- description
- rating, totalCampaigns, totalSpent, isVerified

### Campaign
- title, description
- city, niches (JSON array)
- contentType, budgetPerCreator, maxCreators
- deadline, status
- brandId (foreign key)

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with Google
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### Onboarding
- `POST /api/onboarding` - Create creator/brand profile
  - Body: `{ role: "creator" | "brand", ...profileData }`

### Campaigns
- `GET /api/campaigns?city=Delhi&niche=Fashion` - Fetch campaigns with filters
- `POST /api/campaigns` - Create new campaign (brands only)
  - Body: Campaign data with budget, deadline, etc.

## Form Validation

All forms include:
- Required field validation
- Loading states during submission
- Error handling with user feedback
- Success redirects to appropriate pages
- Type-safe form handling

## Mobile Responsiveness

All pages are fully responsive with:
- Mobile-first design approach
- Hamburger menu for navigation on small screens
- Grid layouts that stack on mobile
- Touch-friendly button sizes (min 48px)
- Optimized spacing and typography

## Next Steps to Complete

1. **Database Models**: Finalize Prisma schema with all relations
2. **Application Model**: Add creator applications to campaigns
3. **Deal Management**: Create deal/escrow model for transactions
4. **Notifications**: Add email/push notifications
5. **Admin Dashboard**: Create admin panel for verification
6. **Payment Integration**: Integrate Razorpay/Stripe for escrow
7. **File Uploads**: Add S3 integration for portfolio images
8. **Analytics**: Add campaign performance tracking
9. **Messaging**: Add in-app messaging between brands and creators
10. **Reviews**: Implement review system for both roles

## Common Commands

```bash
# Development
npm run dev

# Build
npm run build
npm start

# Database
npx prisma migrate dev
npx prisma studio
npx prisma generate

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## Notes for Developers

1. **Session Management**: All protected routes use `getServerSession` or `useSession` hook
2. **Type Safety**: All API responses and form data are fully typed
3. **Client vs Server**: Pages marked with "use client" for interactivity, server components for data fetching
4. **Styling**: Only native Tailwind CSS - no shadcn/ui or component libraries
5. **Icons**: All icons from lucide-react
6. **Constants**: Cities, niches, and categories centralized in `/lib/constants.ts`
7. **Error Handling**: Try-catch blocks with user-friendly error messages
8. **Loading States**: All forms show loading indicators during submission
9. **Animations**: CSS animations in globals.css for smooth UX
10. **Brand Colors**: Use CSS variables in globals.css for consistent theming

## Support & Questions
Email: support@collablocal.com
