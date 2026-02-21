import { z } from "zod";

// ============================================
// Campaign Validations
// ============================================

export const createCampaignSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must be under 2000 characters"),
  city: z.string().min(1, "City is required"),
  niches: z
    .array(z.string())
    .min(1, "At least one niche is required")
    .max(5, "Maximum 5 niches allowed"),
  contentType: z.string().min(1, "Content type is required"),
  budgetPerCreator: z
    .number()
    .int()
    .min(500, "Budget must be at least ₹500")
    .max(500000, "Budget must be under ₹5,00,000"),
  maxCreators: z
    .number()
    .int()
    .min(1, "Must have at least 1 creator")
    .max(50, "Maximum 50 creators allowed"),
  deadline: z.string().refine(
    (d) => new Date(d) > new Date(),
    "Deadline must be in the future"
  ),
});

// ============================================
// Application Validations
// ============================================

export const createApplicationSchema = z.object({
  campaignId: z.string().min(1, "Campaign ID is required"),
  pitchText: z
    .string()
    .min(20, "Pitch must be at least 20 characters")
    .max(1000, "Pitch must be under 1000 characters"),
});

export const updateApplicationSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});

// ============================================
// Deal Validations
// ============================================

export const updateDealSchema = z.object({
  status: z.enum([
    "escrow_held",
    "content_submitted",
    "revision_requested",
    "approved",
    "released",
  ]),
  contentUrl: z.string().url("Content URL must be a valid URL").optional(),
});

// ============================================
// Review Validations
// ============================================

export const createReviewSchema = z.object({
  dealId: z.string().min(1, "Deal ID is required"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .max(500, "Comment must be under 500 characters")
    .optional(),
});

// ============================================
// Profile Validations
// ============================================

export const creatorOnboardingSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be under 50 characters"),
  instagramHandle: z
    .string()
    .min(1, "Instagram handle is required")
    .max(30, "Instagram handle too long"),
  city: z.string().min(1, "City is required"),
  niches: z.array(z.string()).min(1, "At least one niche is required"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  followerCount: z.number().int().min(0).optional(),
  rateMin: z.number().int().min(100).optional(),
  rateMax: z.number().int().min(100).optional(),
});

export const brandOnboardingSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must be under 100 characters"),
  category: z.string().min(1, "Category is required"),
  city: z.string().min(1, "City is required"),
  description: z.string().max(1000, "Description must be under 1000 characters").optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  instagramHandle: z.string().max(30).optional(),
  gstNumber: z.string().max(20).optional(),
});

// ============================================
// Search Validations
// ============================================

export const searchQuerySchema = z.object({
  search: z.string().max(100, "Search query too long").optional(),
  city: z.string().max(50).optional(),
  niche: z.string().max(50).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// ============================================
// Helpers
// ============================================

export function validateBody<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((e: z.ZodIssue) => e.message).join(", ");
    return { success: false, error: errors };
  }
  return { success: true, data: result.data };
}
