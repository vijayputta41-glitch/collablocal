import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city') || '';
    const niche = searchParams.get('niche') || '';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'rating';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {};

    if (city) {
      where.city = city;
    }

    if (niche) {
      where.niches = {
        has: niche,
      };
    }

    if (search) {
      where.OR = [
        {
          displayName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          bio: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Build order by
    const orderBy: any = {};

    switch (sort) {
      case 'followers':
        orderBy.followerCount = 'desc';
        break;
      case 'rate_low':
        orderBy.rateMin = 'asc';
        break;
      case 'rate_high':
        orderBy.rateMax = 'desc';
        break;
      case 'rating':
      default:
        orderBy.avgRating = 'desc';
        break;
    }

    // Fetch creators with pagination
    const creators = await prisma.creatorProfile.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });

    // Get total count for pagination
    const total = await prisma.creatorProfile.count({ where });

    return NextResponse.json(creators, {
      status: 200,
      headers: {
        'X-Total-Count': total.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching creators:', error);
    return NextResponse.json(
      { error: 'Failed to fetch creators' },
      { status: 500 }
    );
  }
}
