import { NextResponse } from "next/server";
import { getReviews } from "@/lib/stamped";
import { TESTIMONIAL_CONSTANTS } from "@/utils/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");

    console.log(
      "API Route: Fetching reviews with limit:",
      limit,
      "page:",
      page
    );

    const response = await getReviews({
      page: page,
      per_page: limit,
    });
    const reviews = response.data;

    console.log(
      "API Route: Raw reviews from Stamped:",
      reviews.length,
      "total reviews"
    );
    console.log("API Route: Full Stamped response structure:", Object.keys(response));
    console.log("API Route: Stamped pagination info:", response.pagination);
    console.log(
      "API Route: Rating breakdown:",
      reviews.map((r) => r.rating)
    );

    // We'll calculate hasNextPage later based on our pagination logic

    // Define banned authors at the top of the function
    const bannedAuthors = [
      "John Herbert",
      "ISO Hydrate",
      "David Gorsline",
      "David Perry",
    ];

    // Transform reviews to match our component interface and filter for 5 stars only
    const allTransformedReviews = reviews
      .filter((review) => review.rating === 5) // Only show 5-star reviews
      .filter((review) => !bannedAuthors.includes(review.author)) // Exclude banned authors
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

    // Limit to REVIEWS_PER_PAGE for 3:1 ratio with videos (13 videos = 39 text reviews total)
    const transformedReviews = allTransformedReviews.slice(0, TESTIMONIAL_CONSTANTS.REVIEWS_PER_PAGE);

    console.log("API Route: Transformed reviews:", transformedReviews);
    console.log(
      "API Route: Rating distribution:",
      transformedReviews.map((r) => r.rating)
    );

    // Create pagination info - we want to limit total to maintain 3:1 ratio
    // 13 videos * 3 text reviews per video = 39 total text reviews
    // 39 reviews / 13 per page = 3 pages
    const totalTextReviewsWanted = 39;
    const totalPagesNeeded = Math.ceil(totalTextReviewsWanted / TESTIMONIAL_CONSTANTS.REVIEWS_PER_PAGE);
    
    // Check if there are more pages by seeing if we got a full page from Stamped API
    // If we got 20 reviews from Stamped, there might be more pages available
    const hasNextPage = page < totalPagesNeeded && reviews.length >= limit;
    const paginationInfo = response.pagination || {
      page: page,
      per_page: TESTIMONIAL_CONSTANTS.REVIEWS_PER_PAGE,
      total: totalTextReviewsWanted,
      total_pages: totalPagesNeeded,
      has_next_page: hasNextPage,
    };

    return NextResponse.json({
      success: true,
      data: transformedReviews,
      pagination: paginationInfo,
    });
  } catch (error) {
    console.error("Error fetching Stamped reviews:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
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
