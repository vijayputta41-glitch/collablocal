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

    // Build query filters
    const where: any = {};

    if (role === "creator") {
      where.creatorId = session.user.id;
    } else if (role === "brand") {
      where.brandId = session.user.id;
    } else {
      // Return deals for both roles
      where.OR = [
        { creatorId: session.user.id },
        { brandId: session.user.id },
      ];
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
