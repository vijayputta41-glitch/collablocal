# CollabLocal - Quick Start Guide

## 30-Second Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env.local`**
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/collablocal
   NEXTAUTH_SECRET=your-random-secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-secret
   ```

3. **Setup database**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Run dev server**
   ```bash
   npm run dev
   ```

5. **Visit** `http://localhost:3000`

## Page Routes

### Public Pages
- `/` - Landing page
- `/login` - Google OAuth login

### Authentication Required
- `/onboarding` - Role selection
- `/onboarding/creator` - Creator form
- `/onboarding/brand` - Brand form
- `/dashboard` - Dashboard home
- `/campaigns` - Browse campaigns
- `/campaigns/new` - Create campaign (brands only)

### Profile Pages
- `/creator/[id]` - Creator profile
- `/brand/[id]` - Brand profile

## Key Features

### Landing Page (`/`)
- Beautiful hero with dual CTAs
- Stats counters (3,500+ Creators, 450+ Brands, ₹63L+ GMV)
- How it works (separate sections for creators/brands)
- Benefits comparison
- Trust/Escrow explanation
- CTA and footer

### Authentication
- Google OAuth via NextAuth.js
- Auto-redirects to onboarding after first login
- Session persists across app

### Onboarding Flow
1. Choose role (Creator or Brand)
2. Fill out profile with detailed info
3. Auto-redirect to dashboard

### Dashboard
- Role-specific stats and widgets
- Quick action buttons
- Creator tips section
- Mobile sidebar with hamburger menu

### Campaigns
- List campaigns with city/niche filters
- View campaign details
- Create new campaigns (brands)
- Public creator/brand profiles

## File Organization

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── onboarding/route.ts
│   │   └── campaigns/route.ts
│   ├── onboarding/
│   │   ├── page.tsx
│   │   ├── creator/page.tsx
│   │   └── brand/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── campaigns/
│   │   ├── page.tsx
│   │   └── new/page.tsx
│   ├── creator/
│   │   └── [id]/page.tsx
│   ├── brand/
│   │   └── [id]/page.tsx
│   ├── login/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── providers.tsx
└── lib/
    ├── db.ts
    ├── auth.ts
    ├── constants.ts
    └── types.ts
```

## Colors Used

```css
--color-coral: #E94560    /* Primary - buttons, highlights */
--color-navy: #1A1A2E     /* Secondary - backgrounds */
--color-blue: #0F3460     /* Accent - brand section */
```

## Custom Tailwind Classes

```html
<!-- Buttons -->
<button class="btn-primary">Primary Button</button>
<button class="btn-secondary">Secondary Button</button>
<button class="btn-outline">Outline Button</button>

<!-- Cards -->
<div class="card p-6">Card content</div>

<!-- Badges -->
<span class="badge">Default badge</span>
<span class="badge-coral">Coral badge</span>
<span class="badge-blue">Blue badge</span>

<!-- Forms -->
<input class="input-field" placeholder="...">

<!-- Animations -->
<div class="animate-fade-in-up">Content</div>
<div class="animate-slide-in-left">Content</div>
```

## API Endpoints

```
POST /api/onboarding
  Body: { role: "creator" | "brand", ...profileData }
  Returns: Created profile

GET /api/campaigns?city=Delhi&niche=Fashion
  Returns: Array of campaigns

POST /api/campaigns
  Body: { title, description, city, niches[], ... }
  Returns: Created campaign
```

## State Management

- **Authentication**: NextAuth.js (session stored in middleware)
- **User Role**: Stored in database and session
- **Form State**: React useState hooks (local component state)
- **Data Fetching**: Built-in fetch API with loading/error states

## Styling Strategy

- **Tailwind CSS**: All utility-based styling
- **Custom CSS**: In `globals.css` for animations and custom utilities
- **No UI Framework**: Pure HTML + Tailwind (no shadcn, Material, etc.)
- **Icons**: lucide-react library
- **Responsive**: Mobile-first approach with breakpoints (md:, lg:)

## Database (Prisma)

Pre-configured models:
- User (auth info, role)
- CreatorProfile (Instagram, niches, rates, stats)
- BrandProfile (business info, stats)
- Campaign (details, budget, deadline)

## Common Tasks

### Add a new city
Edit `/src/lib/constants.ts`:
```ts
export const CITIES = [
  'Delhi',
  'Your City Here',  // Add here
  // ...
];
```

### Change brand colors
Edit `/src/app/globals.css`:
```css
--color-coral: #YourColor;
--color-navy: #YourColor;
--color-blue: #YourColor;
```

### Add a new page
1. Create folder in `/src/app`
2. Create `page.tsx` file
3. Use `'use client'` if interactive
4. Add route to sidebar if needed

### Modify animations
Edit animations in `/src/app/globals.css`:
```css
@keyframes fadeInUp {
  /* Modify timing/distance here */
}
```

## Environment Variables Checklist

- [ ] DATABASE_URL - PostgreSQL connection string
- [ ] NEXTAUTH_SECRET - Random secret (use `openssl rand -base64 32`)
- [ ] NEXTAUTH_URL - App URL (localhost:3000 for dev)
- [ ] GOOGLE_CLIENT_ID - From Google Cloud Console
- [ ] GOOGLE_CLIENT_SECRET - From Google Cloud Console

## Deploy to Vercel

1. Push code to GitHub
2. Import repo in Vercel
3. Add environment variables
4. Deploy

```bash
# Or manually
vercel
```

## Troubleshooting

**Port already in use?**
```bash
npm run dev -- -p 3001
```

**Prisma client missing?**
```bash
npx prisma generate
```

**Database connection error?**
```bash
# Check .env.local DATABASE_URL is correct
# Try connecting manually with psql
psql $DATABASE_URL
```

**NextAuth session not working?**
```bash
# Regenerate NEXTAUTH_SECRET
openssl rand -base64 32
# Update in .env.local
```

## Next Steps

1. Replace mock data in dashboard with real database queries
2. Implement file uploads for portfolio/logos
3. Add payment integration for escrow
4. Build notification system
5. Add admin dashboard for verification
6. Implement messaging feature
7. Add analytics and reporting

## Support

For issues or questions:
- Check SETUP_GUIDE.md for detailed setup
- Review code comments in components
- Check Next.js docs: https://nextjs.org/docs
- Check NextAuth docs: https://next-auth.js.org

---
**Ready to go!** Start with `/` to see the landing page.
