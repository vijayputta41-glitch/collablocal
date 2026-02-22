import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch appropriate profile based on role
    let profile = null;

    if (user.role === 'creator') {
      profile = await prisma.creatorProfile.findUnique({
        where: { userId: user.id },
      });
    } else if (user.role === 'brand') {
      profile = await prisma.brandProfile.findUnique({
        where: { userId: user.id },
      });
    }

    return NextResponse.json({
      user,
      role: user.role,
      profile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.role) {
      return NextResponse.json(
        { error: 'User role not set' },
        { status: 400 }
      );
    }

    let updatedProfile = null;

    if (user.role === 'creator') {
      // Update creator profile
      const creatorData: any = {};

      if (body.displayName !== undefined) creatorData.displayName = body.displayName;
      if (body.bio !== undefined) creatorData.bio = body.bio;
      if (body.instagramHandle !== undefined) creatorData.instagramHandle = body.instagramHandle;
      if (body.city !== undefined) creatorData.city = body.city;
      if (body.niches !== undefined) creatorData.niches = body.niches;
      if (body.followerCount !== undefined) creatorData.followerCount = body.followerCount;
      if (body.engagementRate !== undefined) creatorData.engagementRate = body.engagementRate;
      if (body.rateMin !== undefined) creatorData.rateMin = body.rateMin;
      if (body.rateMax !== undefined) creatorData.rateMax = body.rateMax;
      if (body.portfolioUrls !== undefined) creatorData.portfolioUrls = body.portfolioUrls;

      updatedProfile = await prisma.creatorProfile.update({
        where: { userId: user.id },
        data: creatorData,
      });
    } else if (user.role === 'brand') {
      // Update brand profile
      const brandData: any = {};

      if (body.businessName !== undefined) brandData.businessName = body.businessName;
      if (body.category !== undefined) brandData.category = body.category;
      if (body.city !== undefined) brandData.city = body.city;
      if (body.description !== undefined) brandData.description = body.description;
      if (body.instagramHandle !== undefined) brandData.instagramHandle = body.instagramHandle;
      if (body.website !== undefined) brandData.website = body.website;
      if (body.gstNumber !== undefined) brandData.gstNumber = body.gstNumber;

      updatedProfile = await prisma.brandProfile.update({
        where: { userId: user.id },
        data: brandData,
      });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating profile:', error);

    if (error instanceof Error) {
      if (error.message.includes('An operation failed because it depends on one or more records that were required but not found')) {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
