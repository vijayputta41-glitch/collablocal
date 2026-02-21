import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { createCampaignSchema, validateBody } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const city = searchParams.get("city");
    const niche = searchParams.get("niche");

    const where: any = {
      status: "active",
    };

    if (city) {
      where.city = city;
    }

    if (niche) {
      where.niches = {
        has: niche,
      };
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        brand: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Fetch campaigns error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "brand") {
      return NextResponse.json(
        { error: "Only brands can create campaigns" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validate input
    const validation = validateBody(createCampaignSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { data } = validation;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { brandProfile: true },
    });

    if (!user || !user.brandProfile) {
      return NextResponse.json(
        { error: "Brand profile not found" },
        { status: 404 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        title: data.title,
        description: data.description,
        city: data.city,
        niches: data.niches,
        contentType: data.contentType,
        budgetPerCreator: data.budgetPerCreator,
        maxCreators: data.maxCreators,
        deadline: new Date(data.deadline),
        status: "active",
        brandId: user.brandProfile.id,
      },
      include: {
        brand: true,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Create campaign error:", error);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
