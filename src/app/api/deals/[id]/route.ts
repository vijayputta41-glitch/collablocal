import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
      include: {
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
      },
    });

    if (!deal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    // Check authorization
    const isAuthorized =
      deal.creatorId === session.user.id || deal.brandId === session.user.id;

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

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        campaign: true,
        brand: true,
        creator: true,
      },
    });

    if (!deal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    // Check authorization
    const isBrand = deal.brandId === session.user.id;
    const isCreator = deal.creatorId === session.user.id;

    if (!isBrand && !isCreator) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Validate status transitions
    let updatedDeal;

    if (isCreator && status === "content_submitted") {
      if (!contentUrl) {
        return NextResponse.json(
          { error: "contentUrl is required" },
          { status: 400 }
        );
      }
      updatedDeal = await prisma.deal.update({
        where: { id: id },
        data: {
          escrowStatus: "content_submitted",
          contentUrl,
          revisionRequested: false,
        },
        include: {
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
        },
      });
    } else if (isBrand) {
      if (status === "escrow_held") {
        updatedDeal = await prisma.deal.update({
          where: { id: id },
          data: {
            escrowStatus: "escrow_held",
          },
          include: {
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
          },
        });
      } else if (status === "revision_requested") {
        updatedDeal = await prisma.deal.update({
          where: { id: id },
          data: {
            escrowStatus: "revision_requested",
            revisionRequested: true,
          },
          include: {
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
          },
        });
      } else if (status === "approved") {
        updatedDeal = await prisma.deal.update({
          where: { id: id },
          data: {
            escrowStatus: "approved",
            brandApproved: true,
          },
          include: {
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
          },
        });
      } else if (status === "released") {
        const now = new Date();

        // Update deal
        updatedDeal = await prisma.deal.update({
          where: { id: id },
          data: {
            escrowStatus: "released",
            completedAt: now,
          },
          include: {
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
          },
        });

        // Update creator stats
        await prisma.creatorProfile.update({
          where: { id: deal.creatorId },
          data: {
            totalDeals: { increment: 1 },
            totalEarnings: { increment: deal.amount },
          },
        });

        // Update brand stats
        await prisma.brandProfile.update({
          where: { id: deal.brandId },
          data: {
            totalCampaigns: { increment: 1 },
            totalSpent: { increment: deal.amount + deal.platformFee },
          },
        });
      } else {
        return NextResponse.json(
          { error: "Invalid status transition" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Invalid status transition" },
        { status: 400 }
      );
    }

    return NextResponse.json({ deal: updatedDeal });
  } catch (error) {
    console.error("[PATCH /api/deals/[id]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
