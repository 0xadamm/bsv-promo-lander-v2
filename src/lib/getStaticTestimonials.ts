import { stampedAPI } from "./stamped";
import { list } from "@vercel/blob";

export interface StaticTestimonial {
  id: string;
  name: string;
  avatar: string;
  testimonialText: string;
  date: string;
  rating?: number;
  title?: string;
  verified?: boolean;
  photos?: string[];
  isVideo?: boolean;
  duration?: string;
  videoUrl?: string;
  thumbnailImage?: string;
}

// This function runs at build time to pre-fetch all testimonials
export async function getStaticTestimonials(): Promise<StaticTestimonial[]> {
  try {
    console.log("Static Generation: Fetching all testimonials...");
    
    // Fetch reviews and videos in parallel
    const [reviewsResponse, testimonialBlobs, testimonialVideosBlobs] = await Promise.all([
      stampedAPI.getReviews({ per_page: 100 }).catch((e) => {
        console.error("Static Generation: Error fetching reviews:", e);
        return { data: [], pagination: undefined };
      }),
      list({ prefix: 'testimonials/' }).then(({ blobs }) => blobs).catch((e) => {
        console.error("Static Generation: Error fetching testimonials:", e);
        return [];
      }),
      list({ prefix: 'testimonial videos/' }).then(({ blobs }) => blobs).catch((e) => {
        console.error("Static Generation: Error fetching testimonial videos:", e);
        return [];
      })
    ]);

    const reviews = reviewsResponse.data;
    
    console.log("Static Generation: Found", reviews.length, "reviews");
    console.log("Static Generation: Found", testimonialBlobs.length, "testimonial blobs");
    console.log("Static Generation: Found", testimonialVideosBlobs.length, "testimonial video blobs");

    // Process reviews
    const processedReviews: StaticTestimonial[] = reviews
      .filter(review => review.rating >= 3)
      .map((review, index) => ({
        id: review.id?.toString() || `review-${index}`,
        name: review.author || "Anonymous",
        avatar: "",
        testimonialText: review.body || "No review text available",
        date: formatDate(review.created_at || new Date().toISOString()),
        rating: review.rating,
        title: review.title || "",
        verified: review.verified || false,
        photos: review.photos || [],
        isVideo: false,
      }));

    // Process videos
    const allVideoBlobs = [...testimonialBlobs, ...testimonialVideosBlobs];
    const videoFiles = allVideoBlobs.filter(blob => 
      blob.size > 0 && 
      (blob.pathname.endsWith('.mp4') || 
       blob.pathname.endsWith('.MP4') || 
       blob.pathname.endsWith('.webm') || 
       blob.pathname.endsWith('.mov'))
    );

    const processedVideos: StaticTestimonial[] = videoFiles.map((blob, index) => {
      const filename = blob.pathname.split('/').pop() || '';
      let customerName = `Customer ${index + 1}`;
      
      if (filename.includes('-story-')) {
        customerName = filename.split('-story-')[0].split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      } else if (filename.includes('. ')) {
        const namePart = filename.split('. ')[1]?.split('-')[0];
        if (namePart) {
          customerName = namePart;
        }
      }

      return {
        id: `video-${index}`,
        name: customerName,
        avatar: "",
        testimonialText: "",
        date: ["1d", "2d", "3d", "4d", "5d"][index % 5],
        rating: 5,
        title: "",
        verified: true,
        photos: [],
        isVideo: true,
        videoUrl: blob.url,
        thumbnailImage: blob.url,
        duration: "0:30",
      };
    });

    // Combine and shuffle
    const allTestimonials = [...processedReviews, ...processedVideos];
    const shuffledTestimonials = allTestimonials.sort(() => Math.random() - 0.5);

    console.log(`Static Generation: Generated ${shuffledTestimonials.length} testimonials (${processedReviews.length} reviews + ${processedVideos.length} videos)`);
    
    return shuffledTestimonials;
  } catch (error) {
    console.error("Static Generation: Error fetching testimonials:", error);
    return [];
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