import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/analytics
 * Returns analytics data for the current user based on their role.
 * Creators get: earnings over time, deal completion rate, top niches
 * Brands get: campaign performance, spend over time, creator engagement
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;

    if (role === "creator") {
      return NextResponse.json(await getCreatorAnalytics(session.user.id));
    } else if (role === "brand") {
      return NextResponse.json(await getBrandAnalytics(session.user.id));
    }

    return NextResponse.json({ error: "No role assigned" }, { status: 400 });
  } catch (error) {
    console.error("[GET /api/analytics]", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

async function getCreatorAnalytics(userId: string) {
  const profile = await prisma.creatorProfile.findUnique({
    where: { userId },
    include: {
      deals: {
        include: { campaign: true },
        orderBy: { createdAt: "desc" },
      },
      applications: true,
    },
  });

  if (!profile) return { error: "Creator profile not found" };

  const completedDeals = profile.deals.filter(
    (d) => d.escrowStatus === "released"
  );
  const pendingDeals = profile.deals.filter(
    (d) => !["released", "refunded", "disputed"].includes(d.escrowStatus)
  );

  // Earnings over the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyEarnings = completedDeals
    .filter((d) => d.completedAt && new Date(d.completedAt) >= sixMonthsAgo)
    .reduce(
      (acc, deal) => {
        const month = new Date(deal.completedAt!).toLocaleString("en-IN", {
          month: "short",
          year: "numeric",
        });
        acc[month] = (acc[month] || 0) + deal.amount;
        return acc;
      },
      {} as Record<string, number>
    );

  // Top performing niches
  const nichePerformance = completedDeals.reduce(
    (acc, deal) => {
      const niches = deal.campaign.niches || [];
      niches.forEach((niche) => {
        if (!acc[niche]) acc[niche] = { deals: 0, earnings: 0 };
        acc[niche].deals++;
        acc[niche].earnings += deal.amount;
      });
      return acc;
    },
    {} as Record<string, { deals: number; earnings: number }>
  );

  return {
    summary: {
      totalEarnings: profile.totalEarnings,
      totalDeals: profile.totalDeals,
      avgRating: profile.avgRating,
      level: profile.level,
      pendingDeals: pendingDeals.length,
      applicationSuccessRate:
        profile.applications.length > 0
          ? Math.round(
              (profile.applications.filter((a) => a.status === "accepted")
                .length /
                profile.applications.length) *
                100
            )
          : 0,
    },
    monthlyEarnings,
    nichePerformance,
    recentDeals: profile.deals.slice(0, 5).map((d) => ({
      id: d.id,
      campaign: d.campaign.title,
      amount: d.amount,
      status: d.escrowStatus,
      date: d.createdAt,
    })),
  };
}

async function getBrandAnalytics(userId: string) {
  const profile = await prisma.brandProfile.findUnique({
    where: { userId },
    include: {
      campaigns: {
        include: {
          applications: true,
          deals: true,
        },
        orderBy: { createdAt: "desc" },
      },
      deals: {
        include: { campaign: true, creator: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!profile) return { error: "Brand profile not found" };

  const completedDeals = profile.deals.filter(
    (d) => d.escrowStatus === "released"
  );

  // Monthly spend over 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlySpend = completedDeals
    .filter((d) => d.completedAt && new Date(d.completedAt) >= sixMonthsAgo)
    .reduce(
      (acc, deal) => {
        const month = new Date(deal.completedAt!).toLocaleString("en-IN", {
          month: "short",
          year: "numeric",
        });
        acc[month] = (acc[month] || 0) + deal.amount + deal.platformFee;
        return acc;
      },
      {} as Record<string, number>
    );

  // Campaign performance
  const campaignPerformance = profile.campaigns.map((c) => ({
    id: c.id,
    title: c.title,
    status: c.status,
    applications: c.applications.length,
    deals: c.deals.length,
    completedDeals: c.deals.filter((d) => d.escrowStatus === "released").length,
    budget: c.budgetPerCreator * c.maxCreators,
    spent: c.deals
      .filter((d) => d.escrowStatus === "released")
      .reduce((sum, d) => sum + d.amount + d.platformFee, 0),
  }));

  return {
    summary: {
      totalSpent: profile.totalSpent,
      totalCampaigns: profile.totalCampaigns,
      avgRating: profile.avgRating,
      activeCampaigns: profile.campaigns.filter((c) => c.status === "active")
        .length,
      totalApplicationsReceived: profile.campaigns.reduce(
        (sum, c) => sum + c.applications.length,
        0
      ),
      avgDealCompletionDays:
        completedDeals.length > 0
          ? Math.round(
              completedDeals.reduce((sum, d) => {
                const created = new Date(d.createdAt).getTime();
                const completed = new Date(d.completedAt!).getTime();
                return sum + (completed - created) / (1000 * 60 * 60 * 24);
              }, 0) / completedDeals.length
            )
          : 0,
    },
    monthlySpend,
    campaignPerformance: campaignPerformance.slice(0, 10),
    topCreators: completedDeals
      .slice(0, 5)
      .map((d) => ({
        id: d.creator.id,
        name: d.creator.displayName,
        rating: d.creator.avgRating,
        deals: d.creator.totalDeals,
      })),
  };
}
