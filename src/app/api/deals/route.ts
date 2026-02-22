import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const role = searchParams.get("role"); // 'creator' or 'brand'

    // Resolve the correct profile ID (User ID != Profile ID)
    let creatorProfileId: string | null = null;
    let brandProfileId: string | null = null;

    if (role === "creator" || !role) {
      const creatorProfile = await prisma.creatorProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });
      creatorProfileId = creatorProfile?.id ?? null;
    }

    if (role === "brand" || !role) {
      const brandProfile = await prisma.brandProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });
      brandProfileId = brandProfile?.id ?? null;
    }

    // Build query filters using profile IDs (not user IDs)
    const where: any = {};

    if (role === "creator") {
      if (!creatorProfileId) {
        return NextResponse.json({ deals: [] });
      }
      where.creatorId = creatorProfileId;
    } else if (role === "brand") {
      if (!brandProfileId) {
        return NextResponse.json({ deals: [] });
      }
      where.brandId = brandProfileId;
    } else {
      // Return deals for both roles
      const conditions = [];
      if (creatorProfileId) conditions.push({ creatorId: creatorProfileId });
      if (brandProfileId) conditions.push({ brandId: brandProfileId });
      if (conditions.length === 0) {
        return NextResponse.json({ deals: [] });
      }
      where.OR = conditions;
    }

    if (status) {
      where.escrowStatus = status;
    }

    const deals = await prisma.deal.findMany({
      where,
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            brandId: true,
          },
        },
        brand: {
          select: {
            id: true,
            businessName: true,
          },
        },
        creator: {
          select: {
            id: true,
            displayName: true,
          },
        },
        reviews: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ deals });
  } catch (error) {
    console.error("[GET /api/deals]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
