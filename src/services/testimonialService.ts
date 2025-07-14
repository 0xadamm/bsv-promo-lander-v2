import { cache } from "@/utils/cache";
import { TESTIMONIAL_CONSTANTS } from "@/utils/constants";

export interface StampedReview {
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

interface FetchOptions {
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

interface FetchReviewsResponse {
  reviews: StampedReview[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

class TestimonialService {
  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    maxRetries = TESTIMONIAL_CONSTANTS.RETRY_ATTEMPTS
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          signal: options.signal || AbortSignal.timeout(TESTIMONIAL_CONSTANTS.API_TIMEOUT),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < maxRetries - 1) {
          const delay = TESTIMONIAL_CONSTANTS.RETRY_DELAY * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  async fetchVideos(page = 1, signal?: AbortSignal): Promise<StampedReview[]> {
    const cacheKey = `testimonial-videos-${page}`;
    
    // Check cache first
    const cached = cache.get<StampedReview[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const data = await this.fetchWithRetry<{ success: boolean; data: StampedReview[]; pagination?: any }>(
        `/api/videos?page=${page}`,
        { signal }
      );

      if (data.success) {
        cache.set(cacheKey, data.data, TESTIMONIAL_CONSTANTS.CACHE_TTL);
        return data.data;
      }
      
      return [];
    } catch (error) {
      console.warn("Failed to fetch videos:", error);
      return [];
    }
  }

  async fetchVideosWithPagination(page = 1, signal?: AbortSignal): Promise<{ videos: StampedReview[], pagination?: any }> {
    try {
      const data = await this.fetchWithRetry<{ success: boolean; data: StampedReview[]; pagination?: any }>(
        `/api/videos?page=${page}`,
        { signal }
      );

      if (data.success) {
        return {
          videos: data.data,
          pagination: data.pagination,
        };
      }
      
      return { videos: [] };
    } catch (error) {
      console.warn("Failed to fetch videos:", error);
      return { videos: [] };
    }
  }

  async fetchReviews(options: FetchOptions = {}): Promise<StampedReview[]> {
    const { page = 1, limit = TESTIMONIAL_CONSTANTS.DEFAULT_LIMIT, signal } = options;
    const cacheKey = `testimonial-reviews-${page}-${limit}`;
    
    // Check cache first
    const cached = cache.get<StampedReview[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const data = await this.fetchWithRetry<{ success: boolean; data: StampedReview[]; pagination?: any }>(
        `/api/reviews?limit=${limit}&page=${page}`,
        { signal }
      );

      if (data.success) {
        cache.set(cacheKey, data.data, TESTIMONIAL_CONSTANTS.CACHE_TTL);
        return data.data;
      }
      
      return [];
    } catch (error) {
      console.warn(`Failed to fetch reviews page ${page}:`, error);
      return [];
    }
  }

  async fetchReviewsWithPagination(options: FetchOptions = {}): Promise<FetchReviewsResponse> {
    const { page = 1, limit = TESTIMONIAL_CONSTANTS.DEFAULT_LIMIT, signal } = options;

    try {
      const data = await this.fetchWithRetry<{ success: boolean; data: StampedReview[]; pagination?: any }>(
        `/api/reviews?limit=${limit}&page=${page}`,
        { signal }
      );

      if (data.success) {
        return {
          reviews: data.data,
          pagination: data.pagination,
        };
      }
      
      return { reviews: [] };
    } catch (error) {
      console.warn(`Failed to fetch reviews page ${page}:`, error);
      return { reviews: [] };
    }
  }

  async fetchAllTestimonials(signal?: AbortSignal): Promise<StampedReview[]> {
    const [videos, reviews] = await Promise.allSettled([
      this.fetchVideos(signal),
      this.fetchReviews({ page: 1, limit: TESTIMONIAL_CONSTANTS.DEFAULT_LIMIT, signal }),
    ]);

    const allTestimonials: StampedReview[] = [];

    if (videos.status === 'fulfilled') {
      allTestimonials.push(...videos.value);
    }

    if (reviews.status === 'fulfilled') {
      allTestimonials.push(...reviews.value);
    }

    return allTestimonials;
  }

  clearCache(): void {
    cache.clear();
  }
}

export const testimonialService = new TestimonialService();