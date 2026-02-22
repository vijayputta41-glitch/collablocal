export type UserRole = "creator" | "brand";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole | null;
  name: string | null;
  image: string | null;
  createdAt: string;
  onboardingCompleted: boolean;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  displayName: string;
  bio: string | null;
  instagramHandle: string;
  city: string;
  niches: string[];
  followerCount: number | null;
  engagementRate: number | null;
  rateMin: number;
  rateMax: number;
  portfolioUrls: string[];
  avgRating: number;
  totalDeals: number;
  totalEarnings: number;
  level: "bronze" | "silver" | "gold" | "platinum";
  verified: boolean;
  createdAt: string;
  user?: UserProfile;
}

export interface BrandProfile {
  id: string;
  userId: string;
  businessName: string;
  category: string;
  description: string | null;
  city: string;
  gstNumber: string | null;
  website: string | null;
  instagramHandle: string | null;
  logoUrl: string | null;
  avgRating: number;
  totalCampaigns: number;
  totalSpent: number;
  verified: boolean;
  createdAt: string;
  user?: UserProfile;
}

export interface Campaign {
  id: string;
  brandId: string;
  title: string;
  description: string;
  city: string;
  niches: string[];
  contentType: string;
  budgetPerCreator: number;
  maxCreators: number;
  deadline: string;
  status: string;
  applicationsCount: number;
  createdAt: string;
  brand?: BrandProfile;
  applications?: Application[];
}

export interface Application {
  id: string;
  campaignId: string;
  creatorId: string;
  pitchText: string;
  status: string;
  appliedAt: string;
  creator?: CreatorProfile;
  campaign?: Campaign;
}

export interface Deal {
  id: string;
  campaignId: string;
  brandId: string;
  creatorId: string;
  amount: number;
  platformFee: number;
  escrowStatus: string;
  contentUrl: string | null;
  proofScreenshots: string[];
  revisionRequested: boolean;
  brandApproved: boolean;
  completedAt: string | null;
  createdAt: string;
  campaign?: Campaign;
  brand?: BrandProfile;
  creator?: CreatorProfile;
  reviews?: Review[];
}

export interface Review {
  id: string;
  dealId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}
