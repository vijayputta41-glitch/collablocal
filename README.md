# CollabLocal - Hyper-Local Influencer Marketplace

A complete Next.js 14 application connecting local brands with nano and micro creators in Indian cities. Built with TypeScript, Tailwind CSS, NextAuth.js, Prisma, and PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38B2AC)

## Features

- **38 Source Files** — Full-stack MVP with no placeholders
- **Google OAuth** — Secure authentication with NextAuth.js + PrismaAdapter
- **Two User Roles** — Creators and Brands with separate flows
- **Campaign System** — Browse, create, apply, accept/reject applications
- **Deal Management** — Full escrow lifecycle (fund → submit → approve → release)
- **Creator Discovery** — Search/filter creators by city, niche, rating, followers
- **Review System** — Dual-sided ratings with auto-recalculated averages
- **Public Profiles** — Creator and brand profile pages
- **Profile Editing** — Fully editable profiles for both roles
- **Auth Middleware** — Route protection for authenticated pages
- **Responsive Design** — Mobile-first with Tailwind CSS
- **Custom Animations** — Fade, slide, pulse, count-up effects

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up PostgreSQL (Neon — free)
1. Go to [neon.tech](https://neon.tech) → Create free account → New project
2. Copy the connection string

### 3. Set up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create project → Create OAuth 2.0 Client ID → Web application
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret

### 4. Create `.env.local`
```bash
cp .env.example .env.local
```
Fill in your values:
```env
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 5. Push database schema
```bash
npx prisma generate
npx prisma db push
```

### 6. Run
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages (16)

| Page | Path | Description |
|------|------|-------------|
| Landing | `/` | Hero, how-it-works, benefits, trust, footer |
| Login | `/login` | Google OAuth sign-in |
| Role Selection | `/onboarding` | Choose creator or brand |
| Creator Onboarding | `/onboarding/creator` | Creator profile setup form |
| Brand Onboarding | `/onboarding/brand` | Brand profile setup form |
| Dashboard | `/dashboard` | Role-based stats and quick actions |
| Browse Campaigns | `/campaigns` | Campaign grid with city/niche filters |
| Campaign Detail | `/campaigns/[id]` | Full campaign info + apply button |
| Apply to Campaign | `/campaigns/[id]/apply` | Pitch form for creators |
| Create Campaign | `/campaigns/new` | Campaign creation form (brands) |
| Creator Discovery | `/creators` | Search/filter creators |
| Creator Profile | `/creator/[id]` | Public creator profile |
| Brand Profile | `/brand/[id]` | Public brand profile |
| My Profile | `/profile` | Edit your own profile |
| My Deals | `/deals` | Deal listing with status filters |
| Deal Detail | `/deals/[id]` | Deal timeline + actions |

## API Routes (11)

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth handler (Google OAuth) |
| `/api/onboarding` | POST | Create creator/brand profile |
| `/api/profile` | GET, PATCH | View/edit own profile |
| `/api/campaigns` | GET, POST | List/create campaigns |
| `/api/campaigns/[id]` | GET | Single campaign with details |
| `/api/creators` | GET | Search/filter creators |
| `/api/applications` | GET, POST | List/create applications |
| `/api/applications/[id]` | GET, PATCH | View/accept/reject application |
| `/api/deals` | GET | List user's deals |
| `/api/deals/[id]` | GET, PATCH | View/update deal status |
| `/api/reviews` | POST | Create review + recalculate ratings |

## Database Models (10)

- **User** — Base user with NextAuth fields + role
- **Account/Session/VerificationToken** — NextAuth required
- **CreatorProfile** — Instagram, city, niches, rates, portfolio, ratings
- **BrandProfile** — Business info, category, city, GST, ratings
- **Campaign** — Title, niches[], city, budget, content type, deadline
- **Application** — Creator applies to campaign with pitch
- **Deal** — Escrow-tracked collaboration with full lifecycle
- **Review** — 1-5 star rating + comment, auto-updates averages

## Tech Stack

- **Next.js 14** — App Router, Server + Client Components
- **TypeScript** — Full type safety
- **Tailwind CSS** — Utility-first styling (no shadcn/ui)
- **NextAuth.js v4** — Google OAuth + PrismaAdapter
- **Prisma** — ORM with PostgreSQL
- **Neon** — Serverless PostgreSQL (recommended)
- **lucide-react** — Icons
- **Inter** — Google Font

## Design System

**Brand Colors:** Coral (#E94560), Navy (#1A1A2E), Blue (#0F3460)

**Custom CSS Classes:** btn-primary, btn-secondary, btn-outline, card, badge, badge-coral, badge-blue, input-field, gradient-coral-blue, gradient-navy, text-gradient-coral

**Animations:** fadeInUp, fadeIn, slideInLeft, slideInRight, pulse-glow, count-up

## Deploy

Deploy to Vercel with one click. Set all environment variables in the Vercel dashboard.

## What's Next

- [ ] Razorpay payment integration (real escrow)
- [ ] Instagram API integration (verify follower counts)
- [ ] Email/WhatsApp notifications
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Image upload (S3/Cloudinary)
- [ ] Search with Algolia/Typesense
