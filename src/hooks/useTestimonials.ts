import { useState, useEffect, useCallback, useMemo } from "react";
import { testimonialService, type StampedReview } from "@/services/testimonialService";
import { shuffleArray } from "@/utils/shuffle";
import { TESTIMONIAL_CONSTANTS } from "@/utils/constants";

// Function to interleave videos with text reviews for better distribution in masonry layout
function interleaveTestimonials(reviews: StampedReview[], videos: StampedReview[]): StampedReview[] {
  if (videos.length === 0) return reviews;
  if (reviews.length === 0) return videos;
  
  const result: StampedReview[] = [];
  
  // For masonry layout, we need to distribute videos so they don't align vertically
  // Strategy: Place videos at irregular intervals to break up column alignment
  
  // Create chunks of varying sizes to prevent video alignment
  const chunkSizes = [];
  if (videos.length === 3) {
    // For page 1: irregular chunks like 2, 4, 3, 3
    chunkSizes.push(2, 4, 3, 3);
  } else if (videos.length === 4) {
    // For other pages: irregular chunks like 3, 3, 4, 3, 4
    chunkSizes.push(3, 3, 4, 3, 4);
  } else {
    // Fallback: create irregular chunks
    const avgChunkSize = Math.floor(reviews.length / videos.length);
    for (let i = 0; i < videos.length; i++) {
      const variation = (i % 2 === 0) ? 1 : -1;
      chunkSizes.push(Math.max(1, avgChunkSize + variation));
    }
    // Add remaining reviews to last chunk
    const usedReviews = chunkSizes.reduce((sum, size) => sum + size, 0);
    if (usedReviews < reviews.length) {
      chunkSizes[chunkSizes.length - 1] += (reviews.length - usedReviews);
    }
  }
  
  let reviewIndex = 0;
  let videoIndex = 0;
  
  for (let chunkIndex = 0; chunkIndex < chunkSizes.length && reviewIndex < reviews.length; chunkIndex++) {
    // Add chunk of reviews
    const chunkSize = Math.min(chunkSizes[chunkIndex], reviews.length - reviewIndex);
    for (let i = 0; i < chunkSize; i++) {
      result.push(reviews[reviewIndex]);
      reviewIndex++;
    }
    
    // Add a video after the chunk (if available)
    if (videoIndex < videos.length) {
      result.push(videos[videoIndex]);
      videoIndex++;
    }
  }
  
  // Add any remaining reviews
  while (reviewIndex < reviews.length) {
    result.push(reviews[reviewIndex]);
    reviewIndex++;
  }
  
  return result;
}

interface UseTestimonialsReturn {
  testimonials: StampedReview[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMorePages: boolean;
  loadMoreReviews: () => void;
}

export function useTestimonials(): UseTestimonialsReturn {
  const [testimonials, setTestimonials] = useState<StampedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Shuffle testimonials only on initial load, then maintain order for new additions
  const displayTestimonials = useMemo(() => {
    if (testimonials.length === 0) return [];
    
    // Only shuffle once after the initial load is complete
    if (!isInitialLoadComplete) {
      return shuffleArray(testimonials);
    }
    
    // After initial load, maintain the order to preserve new additions
    return testimonials;
  }, [testimonials, isInitialLoadComplete]);

  // Initial load
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch videos and first page of reviews with pagination info
        const [videosResult, reviewsResult] = await Promise.allSettled([
          testimonialService.fetchVideosWithPagination(1, controller.signal),
          testimonialService.fetchReviewsWithPagination({ 
            page: 1, 
            limit: TESTIMONIAL_CONSTANTS.REVIEWS_PER_PAGE, 
            signal: controller.signal 
          }),
        ]);

        let videos: StampedReview[] = [];
        let reviews: StampedReview[] = [];

        if (videosResult.status === 'fulfilled') {
          videos = videosResult.value.videos;
        }

        if (reviewsResult.status === 'fulfilled') {
          reviews = reviewsResult.value.reviews;
        }

        // Interleave videos with reviews for better distribution
        const allTestimonials = interleaveTestimonials(reviews, videos);

        if (reviewsResult.status === 'fulfilled') {
          // Set pagination info from the first reviews request
          if (reviewsResult.value.pagination) {
            if (reviewsResult.value.pagination.total_pages) {
              setHasMorePages(reviewsResult.value.pagination.page < reviewsResult.value.pagination.total_pages);
            } else {
              // Use has_next_page if available, otherwise fallback to checking result count
              const hasNext = reviewsResult.value.pagination.has_next_page ?? 
                              (reviewsResult.value.reviews.length >= TESTIMONIAL_CONSTANTS.REVIEWS_PER_PAGE);
              setHasMorePages(hasNext);
            }
          } else {
            // Fallback: assume there are more pages if we got a full page of results
            const hasFullPage = reviewsResult.value.reviews.length >= TESTIMONIAL_CONSTANTS.REVIEWS_PER_PAGE;
            setHasMorePages(hasFullPage);
          }
        }

        if (allTestimonials.length === 0) {
          throw new Error("No testimonials found");
        }

        setTestimonials(allTestimonials);
        setIsInitialLoadComplete(true);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return; // Component unmounted, ignore
        }
        
        console.error("Error fetching testimonials:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load testimonials"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      controller.abort();
    };
  }, []);

  // Load more reviews function
  const loadMoreReviews = useCallback(async () => {
    if (loadingMore || !hasMorePages) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      // Fetch both videos and reviews for the next page
      const [videosResult, reviewsResult] = await Promise.allSettled([
        testimonialService.fetchVideosWithPagination(nextPage),
        testimonialService.fetchReviewsWithPagination({
          page: nextPage,
          limit: TESTIMONIAL_CONSTANTS.REVIEWS_PER_PAGE,
        }),
      ]);

      let newVideos: StampedReview[] = [];
      let newReviews: StampedReview[] = [];

      if (videosResult.status === 'fulfilled') {
        newVideos = videosResult.value.videos;
      }

      if (reviewsResult.status === 'fulfilled') {
        newReviews = reviewsResult.value.reviews;
      }

      // Interleave videos with reviews for better distribution
      const newTestimonials = interleaveTestimonials(newReviews, newVideos);

      if (newTestimonials.length > 0) {
        setTestimonials(prev => [...prev, ...newTestimonials]);
        setCurrentPage(nextPage);

        // Update hasMorePages based on both videos and reviews pagination
        let hasMoreReviews = false;
        let hasMoreVideos = false;
        
        if (reviewsResult.status === 'fulfilled' && reviewsResult.value.pagination) {
          if (reviewsResult.value.pagination.total_pages) {
            hasMoreReviews = nextPage < reviewsResult.value.pagination.total_pages;
          } else {
            hasMoreReviews = reviewsResult.value.pagination.has_next_page ?? 
                            (reviewsResult.value.reviews.length >= TESTIMONIAL_CONSTANTS.REVIEWS_PER_PAGE);
          }
        }

        if (videosResult.status === 'fulfilled' && videosResult.value.pagination) {
          hasMoreVideos = videosResult.value.pagination.has_next_page ?? false;
        }

        // Continue loading if either videos or reviews have more pages
        setHasMorePages(hasMoreReviews || hasMoreVideos);
      } else {
        setHasMorePages(false);
      }
    } catch (err) {
      console.error("Error loading more reviews:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMorePages, currentPage]);

  return {
    testimonials: displayTestimonials,
    loading,
    loadingMore,
    error,
    hasMorePages,
    loadMoreReviews,
  };
}