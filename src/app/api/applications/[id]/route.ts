import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { PLATFORM_FEE_PERCENTAGE } from '@/lib/constants';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/applications/[id]
 * Get a single application details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        campaign: {
          include: { brand: true },
        },
        creator: {
          include: { user: true },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Authorization check: brand can view, or creator can view their own
    if (session.user.role === 'brand') {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { brandProfile: true },
      });

      if (!user || user.brandProfile?.id !== application.campaign.brandId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else if (session.user.role === 'creator') {
      if (application.creator.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid user role' }, { status: 403 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}

/**
 * PATCH /api/applications/[id]
 * Update application status (brand only)
 * Can accept or reject an application
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a brand
    if (session.user.role !== 'brand') {
      return NextResponse.json({ error: 'Only brands can update applications' }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body;

    // Validate status
    if (!status || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "accepted" or "rejected"' },
        { status: 400 }
      );
    }

    // Get application
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        campaign: {
          include: { brand: true },
        },
        creator: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Authorization check: brand can only update if it's their campaign
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { brandProfile: true },
    });

    if (!user || user.brandProfile?.id !== application.campaign.brandId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Can only update if application is still pending
    if (application.status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only update pending applications' },
        { status: 400 }
      );
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        campaign: {
          include: { brand: true },
        },
        creator: {
          include: { user: true },
        },
      },
    });

    // If accepting: create a Deal atomically using a transaction
    if (status === 'accepted') {
      const amount = application.campaign.budgetPerCreator;
      const platformFee = Math.round(amount * (PLATFORM_FEE_PERCENTAGE / 100));

      const deal = await prisma.$transaction(async (tx) => {
        // Create the deal
        const newDeal = await tx.deal.create({
          data: {
            campaignId: application.campaignId,
            brandId: application.campaign.brandId,
            creatorId: application.creatorId,
            amount,
            platformFee,
            escrowStatus: 'pending',
          },
        });

        // Increment campaign application count
        await tx.campaign.update({
          where: { id: application.campaignId },
          data: { applicationsCount: { increment: 1 } },
        });

        return newDeal;
      });

      // Return both application and deal
      return NextResponse.json({
        application: updatedApplication,
        deal,
      });
    }

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
