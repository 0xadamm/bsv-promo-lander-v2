import { NextResponse } from "next/server";
import { stampedAPI } from "@/lib/stamped";

export async function GET() {
  try {
    console.log("API Route: Fetching ALL reviews progressively...");

    const reviews = await stampedAPI.getAllReviewsProgressive();
    console.log("API Route: Raw reviews from Stamped (all pages):", reviews);

    // Transform reviews to match our component interface and filter for 3+ stars
    const transformedReviews = reviews
      .filter(review => review.rating >= 3) // Only show 3+ star reviews
      .map((review, index) => ({
        id: review.id?.toString() || `review-${index}`,
        name: review.author || "Anonymous",
        avatar: "", // Will use initials
        testimonialText: review.body || "No review text available",
        date: formatDate(review.created_at || new Date().toISOString()),
        rating: review.rating,
        title: review.title || "",
        verified: review.verified || false,
        photos: review.photos || [],
        isVideo: false, // Stamped doesn't typically have video reviews
      }));

    console.log("API Route: Transformed ALL reviews:", transformedReviews.length);
    console.log("API Route: Rating distribution (all):", transformedReviews.map(r => r.rating));

    return NextResponse.json({
      success: true,
      data: transformedReviews,
    });
  } catch (error) {
    console.error("Error fetching ALL Stamped reviews:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch all reviews",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  } else if (diffHours < 24) {
    return `${diffHours}h`;
  } else if (diffDays < 7) {
    return `${diffDays}d`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)}w`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: diffDays > 365 ? "numeric" : undefined,
    });
  }
}