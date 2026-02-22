import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { role, ...profileData } = body;

    if (!["creator", "brand"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user role and onboarding status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        role,
        onboardingCompleted: true,
      },
    });

    let profile;

    if (role === "creator") {
      const creatorData = {
        displayName: profileData.displayName,
        instagramHandle: profileData.instagramHandle,
        city: profileData.city,
        niches: profileData.niches || [],
        followerCount: profileData.followerCount ? parseInt(profileData.followerCount) : null,
        engagementRate: profileData.engagementRate ? parseFloat(profileData.engagementRate) / 100 : null,
        rateMin: profileData.minRate ? parseInt(profileData.minRate) : 500,
        rateMax: profileData.maxRate ? parseInt(profileData.maxRate) : 5000,
        bio: profileData.bio || null,
        portfolioUrls: profileData.portfolioUrls || [],
      };

      profile = await prisma.creatorProfile.upsert({
        where: { userId: user.id },
        update: creatorData,
        create: {
          userId: user.id,
          ...creatorData,
        },
      });
    } else {
      const brandData = {
        businessName: profileData.businessName,
        category: profileData.category,
        city: profileData.city,
        gstNumber: profileData.gstNumber || null,
        website: profileData.website || null,
        instagramHandle: profileData.instagramHandle || null,
        description: profileData.description || null,
      };

      profile = await prisma.brandProfile.upsert({
        where: { userId: user.id },
        update: brandData,
        create: {
          userId: user.id,
          ...brandData,
        },
      });
    }

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
