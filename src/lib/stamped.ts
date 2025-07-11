// Stamped.io Direct API integration
export interface StampedReview {
  id: string;
  rating: number;
  title: string;
  body: string;
  author: string;
  created_at: string;
  verified: boolean;
  photos?: string[];
  product_id?: string;
  helpful_count?: number;
}

export interface StampedApiResponse {
  data: StampedReview[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

class StampedAPI {
  private storeHash: string;
  private username: string;
  private password: string;
  private baseURL: string;

  constructor() {
    this.storeHash = process.env.STAMPED_STORE_HASH || "288102";
    this.username =
      process.env.STAMPED_USERNAME || "dd1a92af-eee0-4adf-93c4-753b07b35efe";
    this.password =
      process.env.STAMPED_PASSWORD ||
      "51664fd6bcc3c6b5ca6a7f7593ce5fea0002084643ea29b0b3a50bfd6c77c0da";
    this.baseURL = "https://stamped.io/api/v2";

    if (!this.storeHash || !this.username || !this.password) {
      throw new Error(
        "Stamped.io credentials are required: STAMPED_STORE_HASH, STAMPED_USERNAME, STAMPED_PASSWORD"
      );
    }
  }

  // Generate basic auth headers
  private getAuthHeaders(): Record<string, string> {
    const credentials = Buffer.from(
      `${this.username}:${this.password}`
    ).toString("base64");
    return {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    };
  }

  // Fetch reviews using direct API calls
  async getReviews(
    options: {
      page?: number;
      per_page?: number;
      rating?: number;
      verified?: boolean;
      with_photos?: boolean;
      product_id?: string;
    } = {}
  ): Promise<StampedApiResponse> {
    try {
      const startTime = Date.now();
      const params = new URLSearchParams();

      if (options.page) params.append("page", options.page.toString());
      if (options.per_page)
        params.append("per_page", options.per_page.toString());
      if (options.rating) params.append("rating", options.rating.toString());
      if (options.verified !== undefined)
        params.append("verified", options.verified.toString());
      if (options.with_photos !== undefined)
        params.append("with_photos", options.with_photos.toString());
      if (options.product_id) params.append("product_id", options.product_id);

      const url = `${this.baseURL}/${
        this.storeHash
      }/dashboard/reviews?${params.toString()}`;

      console.log("Stamped API: Making request to:", url);
      console.log("Stamped API: With headers:", this.getAuthHeaders());
      console.log("Stamped API: Request started at:", new Date().toISOString());

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(60000), // 60 second timeout
      });

      const duration = Date.now() - startTime;
      console.log("Stamped API: Response status:", response.status);
      console.log("Stamped API: Request completed in:", duration, "ms");
      console.log("Stamped API: Response received at:", new Date().toISOString());
      console.log(
        "Stamped API: Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Stamped API: Error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Stamped API: Raw response data:", data);

      // Handle different response structures from Stamped API
      let reviewsData = [];
      
      if (data.results && Array.isArray(data.results)) {
        // Extract reviews from the results array
        reviewsData = data.results.map((item: { review: StampedReview; customer: { name?: string } }) => ({
          id: item.review?.id,
          rating: item.review?.rating,
          title: item.review?.title || "",
          body: item.review?.body || "",
          author: item.review?.author || item.customer?.name || "Anonymous",
          created_at: item.review?.created_at || new Date().toISOString(),
          verified: item.review?.verified || false,
          photos: item.review?.photos || [],
        }));
      } else if (data.data && Array.isArray(data.data)) {
        reviewsData = data.data;
      } else if (Array.isArray(data)) {
        reviewsData = data;
      }

      return {
        data: reviewsData,
        pagination: data.pagination || undefined,
      };
    } catch (error) {
      console.error("Stamped API error:", error);
      throw new Error(
        `Failed to fetch reviews: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Get featured reviews (typically high-rated with photos)
  async getFeaturedReviews(limit: number = 12): Promise<StampedReview[]> {
    const response = await this.getReviews({
      per_page: limit,
      rating: 4, // 4+ star reviews
      with_photos: true,
    });
    return response.data;
  }

  // Get recent reviews
  async getRecentReviews(limit: number = 57): Promise<StampedReview[]> {
    // Get all reviews with high limit to capture all 5-star reviews
    const response = await this.getReviews({
      per_page: Math.max(limit, 200), // Use provided limit or 200, whichever is higher
    });
    console.log("Stamped API: Got reviews with", response.data.length, "reviews");
    console.log("Stamped API: 5-star reviews:", response.data.filter(r => r.rating === 5).length);
    return response.data;
  }

  // Get recent reviews by page (for pagination)
  async getRecentReviewsByPage(page: number = 1, limit: number = 57): Promise<StampedReview[]> {
    const response = await this.getReviews({
      page: page,
      per_page: limit,
    });
    console.log(`Stamped API: Page ${page} got ${response.data.length} reviews`);
    console.log(`Stamped API: Page ${page} 5-star reviews:`, response.data.filter(r => r.rating === 5).length);
    return response.data;
  }

  // Get all reviews progressively (for background loading)
  async getAllReviewsProgressive(): Promise<StampedReview[]> {
    const allReviews = await this.getAllReviews();
    console.log("Stamped API: Got all", allReviews.length, "total reviews");
    return allReviews;
  }

  // Get all reviews (paginated)
  async getAllReviews(): Promise<StampedReview[]> {
    let allReviews: StampedReview[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages && currentPage <= 5) { // Limit to 5 pages for safety
      try {
        console.log(`Stamped API: Fetching page ${currentPage}`);
        const response = await this.getReviews({
          page: currentPage,
        });

        console.log(`Stamped API: Page ${currentPage} returned ${response.data.length} reviews`);
        allReviews = [...allReviews, ...response.data];

        // Check if we got fewer than 20 reviews (indicating last page)
        if (response.data.length < 20) {
          hasMorePages = false;
        } else {
          currentPage++;
        }
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error);
        hasMorePages = false;
      }
    }

    console.log(`Stamped API: Total reviews collected: ${allReviews.length}`);
    return allReviews;
  }
}

// Singleton instance
export const stampedAPI = new StampedAPI();
