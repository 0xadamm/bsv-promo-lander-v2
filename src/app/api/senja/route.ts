import { NextResponse } from "next/server";
import { TESTIMONIAL_CONSTANTS } from "@/utils/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");

    console.log(
      "API Route: Fetching Senja reviews with limit:",
      limit,
      "page:",
      page
    );

    // Senja API endpoint - check Senja docs for correct endpoint
    const senjaApiUrl = `https://api.senja.io/v1/testimonials`;
    const senjaApiKey = process.env.SENJA_API_KEY;

    if (!senjaApiKey) {
      // Use the provided API key if environment variable is not set
      const fallbackApiKey = "wTt06ev5szUrAyjUU3fAgXZQu0Cj";
      console.log("Using fallback Senja API key");
      
      const response = await fetch(`${senjaApiUrl}?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${fallbackApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Senja API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Route: Raw Senja response with fallback key:", data);

      // Transform and return the data (handle multiple possible response structures)
      const reviewsArray = data.testimonials || data.reviews || data.data || data || [];
      console.log("API Route: Processing", reviewsArray.length, "testimonials from Senja");
      
      const transformedReviews = reviewsArray
        .filter((review: any) => {
          // Only include approved reviews
          const isApproved = review.status === 'approved' || review.approved === true || review.published === true;
          console.log("Review approval status:", review.status, review.approved, review.published, "-> isApproved:", isApproved);
          return isApproved;
        })
        .filter((review: any) => {
          // Only include high-rated reviews (4+ stars if rating exists)
          const rating = review.rating || review.star_rating || 5;
          return rating >= 4;
        })
        .map((review: any, index: number) => ({
          id: review.id?.toString() || `senja-review-${index}`,
          name: review.author?.name || review.customer_name || review.name || review.author || "Anonymous",
          avatar: review.author?.avatar || review.customer_avatar || review.avatar || "",
          testimonialText: review.content || review.text || review.body || review.message || review.testimonial || "No review text available",
          date: formatDate(review.created_at || review.date || review.submitted_at || new Date().toISOString()),
          rating: review.rating || review.star_rating || 5,
          title: review.title || review.headline || "",
          verified: review.verified || true,
          photos: review.photos || review.images || review.attachments || [],
          isVideo: review.type === 'video' || Boolean(review.video_url) || review.media_type === 'video',
          videoUrl: review.video_url || review.video || undefined,
          thumbnailImage: review.thumbnail || review.video_thumbnail || review.preview_image || undefined,
          duration: review.duration || undefined,
        }));

      return NextResponse.json({
        success: true,
        data: transformedReviews,
        pagination: {
          page: page,
          per_page: limit,
          total: data.total || transformedReviews.length,
          total_pages: data.total_pages || Math.ceil((data.total || transformedReviews.length) / limit),
          has_next_page: data.has_next_page || (transformedReviews.length >= limit),
        },
      });
    }

    const response = await fetch(`${senjaApiUrl}?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${senjaApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Senja API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Route: Raw Senja response:", data);

    // Transform Senja reviews to match our component interface
    // Note: Adjust these field mappings based on actual Senja API response structure
    const transformedReviews = (data.reviews || data.data || [])
      .filter((review: any) => review.status === 'approved' || review.approved === true) // Only approved reviews
      .filter((review: any) => review.rating >= 4) // Only 4-5 star reviews
      .map((review: any, index: number) => ({
        id: review.id?.toString() || `senja-review-${index}`,
        name: review.author?.name || review.customer_name || "Anonymous",
        avatar: review.author?.avatar || review.customer_avatar || "",
        testimonialText: review.content || review.text || review.body || "No review text available",
        date: formatDate(review.created_at || review.date || new Date().toISOString()),
        rating: review.rating || 5,
        title: review.title || "",
        verified: review.verified || true, // Senja reviews are typically verified
        photos: review.photos || review.images || [],
        isVideo: review.type === 'video' || Boolean(review.video_url),
        videoUrl: review.video_url || undefined,
        thumbnailImage: review.thumbnail || review.video_thumbnail || undefined,
        duration: review.duration || undefined,
      }));

    console.log("API Route: Transformed Senja reviews:", transformedReviews);
    console.log(
      "API Route: Rating distribution:",
      transformedReviews.map((r: any) => r.rating)
    );

    // Create pagination info
    const paginationInfo = {
      page: page,
      per_page: limit,
      total: data.total || transformedReviews.length,
      total_pages: data.total_pages || Math.ceil((data.total || transformedReviews.length) / limit),
      has_next_page: data.has_next_page || (transformedReviews.length >= limit),
    };

    return NextResponse.json({
      success: true,
      data: transformedReviews,
      pagination: paginationInfo,
    });
  } catch (error) {
    console.error("Error fetching Senja reviews:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Senja reviews",
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