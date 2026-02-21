import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Shared include pattern for deal queries — eliminates duplication
const DEAL_INCLUDE = {
  campaign: true,
  brand: {
    select: {
      id: true,
      businessName: true,
      description: true,
      totalCampaigns: true,
      totalSpent: true,
      avgRating: true,
    },
  },
  creator: {
    select: {
      id: true,
      displayName: true,
      bio: true,
      followerCount: true,
      totalDeals: true,
      totalEarnings: true,
      avgRating: true,
    },
  },
  reviews: {
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  },
} as const;

// Valid status transitions: { currentStatus: [allowedNextStatuses] }
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["escrow_held"],
  escrow_held: ["content_submitted"],
  content_submitted: ["revision_requested", "approved"],
  revision_requested: ["content_submitted"],
  approved: ["released"],
};

// Which role can trigger which transition
const BRAND_TRANSITIONS = ["escrow_held", "revision_requested", "approved", "released"];
const CREATOR_TRANSITIONS = ["content_submitted"];

async function resolveProfileIds(userId: string) {
  const [creatorProfile, brandProfile] = await Promise.all([
    prisma.creatorProfile.findUnique({ where: { userId }, select: { id: true } }),
    prisma.brandProfile.findUnique({ where: { userId }, select: { id: true } }),
  ]);
  return { creatorProfile, brandProfile };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: DEAL_INCLUDE,
    });

    if (!deal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    // Check authorization using profile IDs (resolve User ID → Profile ID)
    const { creatorProfile, brandProfile } = await resolveProfileIds(session.user.id);

    const isAuthorized =
      (creatorProfile && deal.creatorId === creatorProfile.id) ||
      (brandProfile && deal.brandId === brandProfile.id);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({ deal });
  } catch (error) {
    console.error("[GET /api/deals/[id]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status, contentUrl } = body;

    if (!status || typeof status !== "string") {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: { campaign: true, brand: true, creator: true },
    });

    if (!deal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    // Resolve profile IDs for authorization
    const { creatorProfile, brandProfile } = await resolveProfileIds(session.user.id);
    const isBrand = brandProfile !== null && deal.brandId === brandProfile.id;
    const isCreator = creatorProfile !== null && deal.creatorId === creatorProfile.id;

    if (!isBrand && !isCreator) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Validate status transition
    const allowedTransitions = VALID_TRANSITIONS[deal.escrowStatus] || [];
    if (!allowedTransitions.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status transition from "${deal.escrowStatus}" to "${status}". Allowed: ${allowedTransitions.join(", ") || "none"}`,
        },
        { status: 400 }
      );
    }

    // Validate role permission for this transition
    if (isBrand && !BRAND_TRANSITIONS.includes(status)) {
      return NextResponse.json(
        { error: "Brands cannot perform this status transition" },
        { status: 403 }
      );
    }

    if (isCreator && !CREATOR_TRANSITIONS.includes(status)) {
      return NextResponse.json(
        { error: "Creators cannot perform this status transition" },
        { status: 403 }
      );
    }

    // Build the update data based on status
    const updateData: Record<string, unknown> = { escrowStatus: status };

    switch (status) {
      case "content_submitted":
        if (!contentUrl) {
          return NextResponse.json(
            { error: "contentUrl is required for content submission" },
            { status: 400 }
          );
        }
        updateData.contentUrl = contentUrl;
        updateData.revisionRequested = false;
        break;

      case "revision_requested":
        updateData.revisionRequested = true;
        break;

      case "approved":
        updateData.brandApproved = true;
        break;

      case "released":
        updateData.completedAt = new Date();
        break;
    }

    // For "released" status, use a transaction to atomically update deal + stats
    if (status === "released") {
      const [updatedDeal] = await prisma.$transaction([
        prisma.deal.update({
          where: { id },
          data: updateData,
          include: DEAL_INCLUDE,
        }),
        prisma.creatorProfile.update({
          where: { id: deal.creatorId },
          data: {
            totalDeals: { increment: 1 },
            totalEarnings: { increment: deal.amount },
          },
        }),
        prisma.brandProfile.update({
          where: { id: deal.brandId },
          data: {
            totalCampaigns: { increment: 1 },
            totalSpent: { increment: deal.amount + deal.platformFee },
          },
        }),
      ]);

      return NextResponse.json({ deal: updatedDeal });
    }

    // Standard update for all other statuses
    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: updateData,
      include: DEAL_INCLUDE,
    });

    return NextResponse.json({ deal: updatedDeal });
  } catch (error) {
    console.error("[PATCH /api/deals/[id]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
