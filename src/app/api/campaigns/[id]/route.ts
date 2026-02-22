import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/campaigns/[id]
 * Fetch a single campaign with brand info and applications
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        brand: {
          include: {
            user: true,
          },
        },
        applications: {
          select: {
            id: true,
            status: true,
            creatorId: true,
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Fetch campaign error:', error);
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
}
