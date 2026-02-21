import { prisma } from "@/lib/db";

type NotificationType =
  | "application_received"
  | "application_accepted"
  | "application_rejected"
  | "deal_updated"
  | "review_received"
  | "campaign_expired";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create a notification for a user.
 * This is a fire-and-forget helper — it logs errors but doesn't throw.
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  linkUrl,
  metadata,
}: CreateNotificationParams) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        linkUrl,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error("[createNotification] Failed to create notification:", error);
  }
}

/**
 * Notify a brand when they receive a new application
 */
export async function notifyApplicationReceived(
  brandUserId: string,
  creatorName: string,
  campaignTitle: string,
  applicationId: string
) {
  return createNotification({
    userId: brandUserId,
    type: "application_received",
    title: "New Application",
    message: `${creatorName} applied to your campaign "${campaignTitle}"`,
    linkUrl: `/applications`,
    metadata: { applicationId },
  });
}

/**
 * Notify a creator when their application is accepted
 */
export async function notifyApplicationAccepted(
  creatorUserId: string,
  brandName: string,
  campaignTitle: string,
  dealId: string
) {
  return createNotification({
    userId: creatorUserId,
    type: "application_accepted",
    title: "Application Accepted!",
    message: `${brandName} accepted your application for "${campaignTitle}"`,
    linkUrl: `/deals/${dealId}`,
    metadata: { dealId },
  });
}

/**
 * Notify a creator when their application is rejected
 */
export async function notifyApplicationRejected(
  creatorUserId: string,
  brandName: string,
  campaignTitle: string
) {
  return createNotification({
    userId: creatorUserId,
    type: "application_rejected",
    title: "Application Update",
    message: `${brandName} did not proceed with your application for "${campaignTitle}"`,
    linkUrl: `/campaigns`,
  });
}

/**
 * Notify about deal status changes
 */
export async function notifyDealUpdate(
  userId: string,
  dealId: string,
  campaignTitle: string,
  newStatus: string
) {
  const statusMessages: Record<string, string> = {
    escrow_held: "Funds have been secured in escrow",
    content_submitted: "Content has been submitted for review",
    revision_requested: "A revision has been requested",
    approved: "Content has been approved",
    released: "Payment has been released",
  };

  return createNotification({
    userId,
    type: "deal_updated",
    title: "Deal Update",
    message: `${statusMessages[newStatus] || "Deal status updated"} for "${campaignTitle}"`,
    linkUrl: `/deals/${dealId}`,
    metadata: { dealId, newStatus },
  });
}
