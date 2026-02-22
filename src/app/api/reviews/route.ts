import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { dealId, rating, comment } = body;

    if (!dealId || !rating) {
      return NextResponse.json(
        { error: "dealId and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Fetch the deal to verify it exists and is completed
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        brand: true,
        creator: true,
      },
    });

    if (!deal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    // Check if deal is released/completed
    if (deal.escrowStatus !== "released") {
      return NextResponse.json(
        { error: "Deal must be released to leave a review" },
        { status: 400 }
      );
    }

    // Check if reviewer is part of the deal
    const isParticipant =
      deal.creatorId === session.user.id || deal.brandId === session.user.id;

    if (!isParticipant) {
      return NextResponse.json(
        { error: "Only deal participants can leave reviews" },
        { status: 403 }
      );
    }

    // Determine reviewer and reviewee
    let reviewerId = session.user.id;
    let revieweeId: string;

    if (deal.creatorId === session.user.id) {
      revieweeId = deal.brandId;
    } else {
      revieweeId = deal.creatorId;
    }

    // Check if review already exists for this combination
    const existingReview = await prisma.review.findUnique({
      where: {
        dealId_reviewerId: {
          dealId,
          reviewerId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this deal" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        dealId,
        reviewerId,
        revieweeId,
        rating,
        comment: comment || null,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Recalculate average rating for the reviewee
    const reviews = await prisma.review.findMany({
      where: { revieweeId },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0;

    // Update the reviewee's profile with new average rating
    if (deal.creatorId === revieweeId) {
      await prisma.creatorProfile.update({
        where: { id: revieweeId },
        data: {
          avgRating: averageRating,
        },
      });
    } else {
      await prisma.brandProfile.update({
        where: { id: revieweeId },
        data: {
          avgRating: averageRating,
        },
      });
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && (error as any).code === "P2002") {
      return NextResponse.json(
        { error: "You have already reviewed this deal" },
        { status: 400 }
      );
    }
    console.error("[POST /api/reviews]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
