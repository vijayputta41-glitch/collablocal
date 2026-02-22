import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        creatorProfile: true,
        brandProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === 'creator' && user.creatorProfile) {
      const profile = user.creatorProfile;

      // Get deals
      const deals = await prisma.deal.findMany({
        where: { creatorId: profile.id },
        include: {
          campaign: true,
          brand: true,
          reviews: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      // Get applications
      const applications = await prisma.application.findMany({
        where: { creatorId: profile.id },
        include: {
          campaign: { include: { brand: true } },
        },
        orderBy: { appliedAt: 'desc' },
        take: 5,
      });

      const totalDeals = deals.length;
      const completedDeals = deals.filter(d => d.escrowStatus === 'released').length;
      const totalEarnings = deals
        .filter(d => d.escrowStatus === 'released')
        .reduce((sum, d) => sum + d.amount - d.platformFee, 0);
      const pendingEarnings = deals
        .filter(d => ['escrow_held', 'content_submitted', 'approved'].includes(d.escrowStatus))
        .reduce((sum, d) => sum + d.amount - d.platformFee, 0);
      const activeDeals = deals.filter(d =>
        !['released', 'refunded', 'disputed'].includes(d.escrowStatus)
      ).length;

      // Recent activity
      const recentActivity = [
        ...deals.slice(0, 5).map(d => ({
          type: 'deal' as const,
          id: d.id,
          title: d.campaign.title,
          status: d.escrowStatus,
          amount: d.amount,
          date: d.createdAt.toISOString(),
          otherParty: d.brand.businessName,
        })),
        ...applications.map(a => ({
          type: 'application' as const,
          id: a.id,
          title: a.campaign.title,
          status: a.status,
          amount: a.campaign.budgetPerCreator,
          date: a.appliedAt.toISOString(),
          otherParty: a.campaign.brand.businessName,
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

      return NextResponse.json({
        role: 'creator',
        stats: {
          totalDeals,
          completedDeals,
          activeDeals,
          totalEarnings,
          pendingEarnings,
          avgRating: profile.avgRating,
          totalReviews: profile.totalDeals,
          followerCount: profile.followerCount,
          profileViews: 0, // placeholder
        },
        recentActivity,
        profile: {
          displayName: profile.displayName,
          city: profile.city,
          verified: profile.verified,
          level: profile.level,
        },
      });
    } else if (user.role === 'brand' && user.brandProfile) {
      const profile = user.brandProfile;

      // Get campaigns
      const campaigns = await prisma.campaign.findMany({
        where: { brandId: profile.id },
        include: {
          applications: true,
          deals: {
            include: {
              creator: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
      const totalApplications = campaigns.reduce((sum, c) => sum + c.applications.length, 0);
      const pendingApplications = campaigns.reduce(
        (sum, c) => sum + c.applications.filter(a => a.status === 'pending').length,
        0
      );

      const allDeals = campaigns.flatMap(c => c.deals);
      const totalSpent = allDeals
        .filter(d => d.escrowStatus === 'released')
        .reduce((sum, d) => sum + d.amount, 0);
      const activeDeals = allDeals.filter(d =>
        !['released', 'refunded', 'disputed'].includes(d.escrowStatus)
      ).length;
      const uniqueCreators = new Set(allDeals.map(d => d.creatorId)).size;

      // Recent activity
      const recentApplications = campaigns.flatMap(c =>
        c.applications.map(a => ({
          type: 'application' as const,
          id: a.id,
          title: c.title,
          status: a.status,
          amount: c.budgetPerCreator,
          date: a.appliedAt.toISOString(),
          otherParty: '', // will be filled from creator name
        }))
      );

      const recentDeals = allDeals.slice(0, 5).map(d => ({
        type: 'deal' as const,
        id: d.id,
        title: campaigns.find(c => c.id === d.campaignId)?.title || 'Campaign',
        status: d.escrowStatus,
        amount: d.amount,
        date: d.createdAt.toISOString(),
        otherParty: d.creator.displayName,
      }));

      const recentActivity = [...recentApplications, ...recentDeals]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);

      return NextResponse.json({
        role: 'brand',
        stats: {
          activeCampaigns,
          totalCampaigns: campaigns.length,
          totalApplications,
          pendingApplications,
          totalSpent,
          activeDeals,
          avgRating: profile.avgRating,
          uniqueCreators,
        },
        recentActivity,
        profile: {
          businessName: profile.businessName,
          city: profile.city,
          verified: profile.verified,
          category: profile.category,
        },
      });
    }

    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
