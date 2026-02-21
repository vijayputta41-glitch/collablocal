export const CITIES = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Chandigarh',
  'Indore',
  'Coimbatore',
  'Visakhapatnam',
  'Surat',
  'Vadodara',
  'Goa',
  'Kochi',
  'Thiruvananthapuram',
  'Bhopal',
  'Nagpur',
  'Raipur',
  'Patna',
  'Ranchi',
];

export const NICHES = [
  'Fashion',
  'Beauty',
  'Food & Beverage',
  'Fitness',
  'Health & Wellness',
  'Lifestyle',
  'Travel',
  'Technology',
  'Gaming',
  'Education',
  'Finance',
  'Parenting',
  'Home & Decor',
  'Automotive',
  'Pets',
  'Entertainment',
  'Photography',
  'Cooking',
  'DIY & Craft',
  'Books & Reading',
];

export const BRAND_CATEGORIES = [
  'Fashion & Apparel',
  'Beauty & Cosmetics',
  'Food & Beverage',
  'Health & Wellness',
  'Electronics & Gadgets',
  'Home & Decor',
  'Fitness & Sports',
  'Travel & Tourism',
  'Education',
  'Finance & Banking',
  'Automotive',
  'Real Estate',
  'Entertainment',
  'Pets & Pet Care',
  'Sustainable & Eco',
  'Photography & Art',
  'Furniture',
  'Jewelry',
  'Retail & E-commerce',
  'Services',
];

export const CONTENT_TYPES = [
  'Instagram Post',
  'Instagram Reel',
  'Instagram Story',
  'TikTok Video',
  'YouTube Short',
  'Blog Post',
  'Podcast Mention',
  'Unboxing Video',
  'Tutorial',
  'Review',
  'Testimonial',
  'Product Demo',
  'Multiple Posts',
];

export const CAMPAIGN_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  DRAFT: 'draft',
} as const;

export const DEAL_STATUS = {
  PENDING: 'pending',
  ESCROW_HELD: 'escrow_held',
  CONTENT_SUBMITTED: 'content_submitted',
  REVISION_REQUESTED: 'revision_requested',
  APPROVED: 'approved',
  RELEASED: 'released',
  REFUNDED: 'refunded',
  DISPUTED: 'disputed',
} as const;

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

// ============================================
// Business Constants
// ============================================

export const PLATFORM_FEE_PERCENTAGE = 12; // 12% platform fee on deals

export const CREATOR_LEVELS = {
  BRONZE: { name: 'bronze', minDeals: 0, minEarnings: 0 },
  SILVER: { name: 'silver', minDeals: 5, minEarnings: 25000 },
  GOLD: { name: 'gold', minDeals: 15, minEarnings: 100000 },
  PLATINUM: { name: 'platinum', minDeals: 30, minEarnings: 500000 },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
} as const;
