import { useState, useEffect, useCallback } from "react";
import { testimonialService, type StampedReview } from "@/services/testimonialService";
import { shuffleArray } from "@/utils/shuffle";
import { TESTIMONIAL_CONSTANTS } from "@/utils/constants";

// Optimized function to interleave videos with text reviews for better distribution
function interleaveTestimonials(reviews: StampedReview[], videos: StampedReview[]): StampedReview[] {
  if (videos.length === 0) return reviews;
  if (reviews.length === 0) return videos;
  
  const result: StampedReview[] = [];
  
  // Simplified distribution algorithm for better performance
  const totalItems = reviews.length + videos.length;
  const videoInterval = Math.floor(totalItems / videos.length);
  
  let reviewIndex = 0;
  let videoIndex = 0;
  let nextVideoPosition = videoInterval;
  
  for (let i = 0; i < totalItems; i++) {
    if (i === nextVideoPosition && videoIndex < videos.length) {
      result.push(videos[videoIndex]);
      videoIndex++;
      nextVideoPosition += videoInterval;
    } else if (reviewIndex < reviews.length) {
      result.push(reviews[reviewIndex]);
      reviewIndex++;
    }
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

  // Memoized shuffled testimonials - only shuffle once on initial load
  const [shuffledTestimonials, setShuffledTestimonials] = useState<StampedReview[]>([]);
  
  // Update shuffled testimonials when testimonials change
  useEffect(() => {
    if (testimonials.length === 0) {
      setShuffledTestimonials([]);
      return;
    }
    
    if (!isInitialLoadComplete) {
      // Only shuffle on initial load
      setShuffledTestimonials(shuffleArray([...testimonials]));
    } else {
      // After initial load, maintain order for new additions
      setShuffledTestimonials(prev => [...prev, ...testimonials.slice(prev.length)]);
    }
  }, [testimonials, isInitialLoadComplete]);

  // Initial load
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch videos, reviews, and Senja reviews with pagination info
        const [videosResult, reviewsResult, senjaResult] = await Promise.allSettled([
          testimonialService.fetchVideosWithPagination(1, controller.signal),
          testimonialService.fetchReviewsWithPagination({ 
            page: 1, 
            limit: TESTIMONIAL_CONSTANTS.REVIEWS_PER_PAGE, 
            signal: controller.signal 
          }),
          testimonialService.fetchSenjaReviewsWithPagination({ 
            page: 1, 
            limit: TESTIMONIAL_CONSTANTS.REVIEWS_PER_PAGE, 
            signal: controller.signal 
          }),
        ]);

        let videos: StampedReview[] = [];
        let reviews: StampedReview[] = [];
        let senjaReviews: StampedReview[] = [];

        if (videosResult.status === 'fulfilled') {
          videos = videosResult.value.videos;
        }

        if (reviewsResult.status === 'fulfilled') {
          reviews = reviewsResult.value.reviews;
        }

        if (senjaResult.status === 'fulfilled') {
          senjaReviews = senjaResult.value.reviews;
          console.log('Senja reviews fetched:', senjaReviews.length);
        } else {
          console.error('Failed to fetch Senja reviews:', senjaResult.reason);
        }

        // Combine all text reviews (Stamped + Senja)
        const allTextReviews = [...reviews, ...senjaReviews];

        // Interleave videos with all text reviews for better distribution
        const allTestimonials = interleaveTestimonials(allTextReviews, videos);

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

      // Fetch videos, reviews, and Senja reviews for the next page
      const [videosResult, reviewsResult, senjaResult] = await Promise.allSettled([
        testimonialService.fetchVideosWithPagination(nextPage),
        testimonialService.fetchReviewsWithPagination({
          page: nextPage,
          limit: TESTIMONIAL_CONSTANTS.REVIEWS_PER_PAGE,
        }),
        testimonialService.fetchSenjaReviewsWithPagination({
          page: nextPage,
          limit: TESTIMONIAL_CONSTANTS.REVIEWS_PER_PAGE,
        }),
      ]);

      let newVideos: StampedReview[] = [];
      let newReviews: StampedReview[] = [];
      let newSenjaReviews: StampedReview[] = [];

      if (videosResult.status === 'fulfilled') {
        newVideos = videosResult.value.videos;
      }

      if (reviewsResult.status === 'fulfilled') {
        newReviews = reviewsResult.value.reviews;
      }

      if (senjaResult.status === 'fulfilled') {
        newSenjaReviews = senjaResult.value.reviews;
      }

      // Combine all new text reviews (Stamped + Senja)
      const allNewTextReviews = [...newReviews, ...newSenjaReviews];

      // Interleave videos with all new text reviews for better distribution
      const newTestimonials = interleaveTestimonials(allNewTextReviews, newVideos);

      if (newTestimonials.length > 0) {
        setTestimonials(prev => [...prev, ...newTestimonials]);
        setCurrentPage(nextPage);

        // Update hasMorePages based on videos, reviews, and Senja reviews pagination
        let hasMoreReviews = false;
        let hasMoreVideos = false;
        let hasMoreSenjaReviews = false;
        
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

        if (senjaResult.status === 'fulfilled' && senjaResult.value.pagination) {
          if (senjaResult.value.pagination.total_pages) {
            hasMoreSenjaReviews = nextPage < senjaResult.value.pagination.total_pages;
          } else {
            hasMoreSenjaReviews = senjaResult.value.pagination.has_next_page ?? 
                                 (senjaResult.value.reviews.length >= TESTIMONIAL_CONSTANTS.REVIEWS_PER_PAGE);
          }
        }

        // Continue loading if any source has more pages
        setHasMorePages(hasMoreReviews || hasMoreVideos || hasMoreSenjaReviews);
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
    testimonials: shuffledTestimonials,
    loading,
    loadingMore,
    error,
    hasMorePages,
    loadMoreReviews,
  };
}