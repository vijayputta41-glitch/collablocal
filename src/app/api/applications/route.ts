import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/applications
 * Create a new application from a creator to a campaign
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a creator
    if (session.user.role !== 'creator') {
      return NextResponse.json({ error: 'Only creators can apply to campaigns' }, { status: 403 });
    }

    const body = await req.json();
    const { campaignId, pitchText } = body;

    // Validate input
    if (!campaignId || !pitchText) {
      return NextResponse.json({ error: 'Campaign ID and pitch text are required' }, { status: 400 });
    }

    if (pitchText.trim().length < 50) {
      return NextResponse.json({ error: 'Pitch text must be at least 50 characters' }, { status: 400 });
    }

    // Get creator profile
    const creator = await prisma.creatorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!creator) {
      return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 });
    }

    // Check if campaign exists and is active
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { applications: true },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.status !== 'active') {
      return NextResponse.json({ error: 'Campaign is not active' }, { status: 400 });
    }

    // Check if slots are available
    if (campaign.applications.length >= campaign.maxCreators) {
      return NextResponse.json({ error: 'Campaign is full' }, { status: 400 });
    }

    // Check if creator has already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        campaignId_creatorId: {
          campaignId,
          creatorId: creator.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied to this campaign' }, { status: 409 });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        campaignId,
        creatorId: creator.id,
        pitchText,
        status: 'pending',
      },
      include: {
        campaign: {
          include: { brand: true },
        },
        creator: true,
      },
    });

    // Increment campaign applications count
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        applicationsCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}

/**
 * GET /api/applications
 * Get applications:
 * - If brand: get all applications for their campaigns
 * - If creator: get their own applications
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role === 'brand') {
      // Get all applications for this brand's campaigns
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { brandProfile: true },
      });

      if (!user || !user.brandProfile) {
        return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 });
      }

      const applications = await prisma.application.findMany({
        where: {
          campaign: {
            brandId: user.brandProfile.id,
          },
        },
        include: {
          campaign: {
            include: { brand: true },
          },
          creator: {
            include: { user: true },
          },
        },
        orderBy: {
          appliedAt: 'desc',
        },
      });

      return NextResponse.json(applications);
    } else if (session.user.role === 'creator') {
      // Get creator's applications
      const creator = await prisma.creatorProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (!creator) {
        return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 });
      }

      const applications = await prisma.application.findMany({
        where: {
          creatorId: creator.id,
        },
        include: {
          campaign: {
            include: { brand: true },
          },
          creator: {
            include: { user: true },
          },
        },
        orderBy: {
          appliedAt: 'desc',
        },
      });

      return NextResponse.json(applications);
    } else {
      return NextResponse.json({ error: 'Invalid user role' }, { status: 403 });
    }
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
