-- CollabLocal Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- ============================================
-- 1. USER PROFILES (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('creator', 'brand')),
  full_name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. CREATOR PROFILES
-- ============================================
CREATE TABLE public.creator_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  instagram_handle TEXT NOT NULL,
  city TEXT NOT NULL,
  niches TEXT[] NOT NULL DEFAULT '{}',
  follower_count INTEGER,
  engagement_rate DECIMAL(5,2),
  rate_min INTEGER NOT NULL DEFAULT 500,
  rate_max INTEGER NOT NULL DEFAULT 5000,
  portfolio_urls TEXT[] DEFAULT '{}',
  avg_rating DECIMAL(3,2) DEFAULT 0,
  total_deals INTEGER DEFAULT 0,
  total_earnings INTEGER DEFAULT 0,
  level TEXT DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold', 'platinum')),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_creator_city ON public.creator_profiles(city);
CREATE INDEX idx_creator_niches ON public.creator_profiles USING GIN(niches);
CREATE INDEX idx_creator_rating ON public.creator_profiles(avg_rating DESC);

-- ============================================
-- 3. BRAND PROFILES
-- ============================================
CREATE TABLE public.brand_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  gst_number TEXT,
  website TEXT,
  instagram_handle TEXT,
  logo_url TEXT,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  total_campaigns INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_brand_city ON public.brand_profiles(city);

-- ============================================
-- 4. CAMPAIGNS
-- ============================================
CREATE TABLE public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  niche TEXT NOT NULL,
  content_type TEXT NOT NULL,
  budget_per_creator INTEGER NOT NULL,
  max_creators INTEGER NOT NULL DEFAULT 5,
  deadline DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaign_city ON public.campaigns(city);
CREATE INDEX idx_campaign_niche ON public.campaigns(niche);
CREATE INDEX idx_campaign_status ON public.campaigns(status);
CREATE INDEX idx_campaign_created ON public.campaigns(created_at DESC);

-- ============================================
-- 5. APPLICATIONS
-- ============================================
CREATE TABLE public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE NOT NULL,
  pitch_text TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, creator_id)
);

CREATE INDEX idx_application_campaign ON public.applications(campaign_id);
CREATE INDEX idx_application_creator ON public.applications(creator_id);

-- ============================================
-- 6. DEALS
-- ============================================
CREATE TABLE public.deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) NOT NULL,
  brand_id UUID REFERENCES public.brand_profiles(id) NOT NULL,
  creator_id UUID REFERENCES public.creator_profiles(id) NOT NULL,
  amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL,
  escrow_status TEXT DEFAULT 'pending' CHECK (escrow_status IN (
    'pending', 'escrow_held', 'content_submitted', 'revision_requested',
    'approved', 'released', 'refunded', 'disputed'
  )),
  content_url TEXT,
  proof_screenshots TEXT[] DEFAULT '{}',
  revision_requested BOOLEAN DEFAULT FALSE,
  brand_approved BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deal_brand ON public.deals(brand_id);
CREATE INDEX idx_deal_creator ON public.deals(creator_id);
CREATE INDEX idx_deal_status ON public.deals(escrow_status);

-- ============================================
-- 7. REVIEWS
-- ============================================
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id) NOT NULL,
  reviewer_id UUID REFERENCES public.profiles(id) NOT NULL,
  reviewee_id UUID REFERENCES public.profiles(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(deal_id, reviewer_id)
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Creator Profiles
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view creator profiles" ON public.creator_profiles FOR SELECT USING (true);
CREATE POLICY "Creators can insert own profile" ON public.creator_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creators can update own profile" ON public.creator_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Brand Profiles
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view brand profiles" ON public.brand_profiles FOR SELECT USING (true);
CREATE POLICY "Brands can insert own profile" ON public.brand_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Brands can update own profile" ON public.brand_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active campaigns" ON public.campaigns FOR SELECT USING (status = 'active' OR brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Brands can create campaigns" ON public.campaigns FOR INSERT WITH CHECK (brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Brands can update own campaigns" ON public.campaigns FOR UPDATE USING (brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid()));

-- Applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Campaign owners and applicants can view" ON public.applications FOR SELECT USING (
  creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid())
  OR campaign_id IN (SELECT id FROM public.campaigns WHERE brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Creators can apply" ON public.applications FOR INSERT WITH CHECK (creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid()));

-- Deals
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deal participants can view" ON public.deals FOR SELECT USING (
  creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid())
  OR brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid())
);

-- Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Deal participants can review" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ============================================
-- HELPER FUNCTION: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_creator_profiles_updated_at BEFORE UPDATE ON public.creator_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON public.brand_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
