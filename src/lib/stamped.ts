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

interface StampedOptions {
  page?: number;
  per_page?: number;
  rating?: number;
  verified?: boolean;
  with_photos?: boolean;
  product_id?: string;
}

interface StampedRawReview {
  review: {
    id: number;
    rating: number;
    title: string;
    body: string;
    author: string;
    dateCreated: string;
    created_at?: string;
    verifiedType: number;
    verified?: boolean;
    mediaList: string[];
    photos?: string[];
  };
  customer?: {
    name?: string;
  };
}

const STAMPED_CONFIG = {
  baseURL: "https://stamped.io/api/v2",
  storeHash: process.env.STAMPED_STORE_HASH ?? "288102",
  username: process.env.STAMPED_USERNAME ?? "dd1a92af-eee0-4adf-93c4-753b07b35efe",
  password: process.env.STAMPED_PASSWORD ?? "51664fd6bcc3c6b5ca6a7f7593ce5fea0002084643ea29b0b3a50bfd6c77c0da"
} as const;

const getAuthHeaders = (): Record<string, string> => {
  const credentials = btoa(`${STAMPED_CONFIG.username}:${STAMPED_CONFIG.password}`);
  return {
    "Content-Type": "application/json",
    Authorization: `Basic ${credentials}`,
  };
};

const buildParams = (options: StampedOptions): string => {
  const params = new URLSearchParams();
  
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });

  return params.toString();
};

const parseReviewsData = (data: unknown): StampedReview[] => {
  if (typeof data !== 'object' || data === null) {
    return [];
  }

  const dataObj = data as Record<string, unknown>;
  
  if (dataObj.results && Array.isArray(dataObj.results)) {
    return dataObj.results.map((item: StampedRawReview) => ({
      id: item.review?.id?.toString() ?? Math.random().toString(),
      rating: item.review?.rating ?? 0,
      title: item.review?.title ?? "",
      body: item.review?.body ?? "",
      author: item.review?.author ?? item.customer?.name ?? "Anonymous",
      created_at: item.review?.dateCreated ?? item.review?.created_at ?? new Date().toISOString(),
      verified: (item.review?.verifiedType ?? 0) > 0,
      photos: item.review?.mediaList ?? item.review?.photos ?? [],
    }));
  }
  
  if (dataObj.data && Array.isArray(dataObj.data)) {
    return dataObj.data;
  }
  
  if (Array.isArray(data)) {
    return data;
  }
  
  return [];
};

export const getReviews = async (options: StampedOptions = {}): Promise<StampedApiResponse> => {
  if (!STAMPED_CONFIG.storeHash || !STAMPED_CONFIG.username || !STAMPED_CONFIG.password) {
    throw new Error(
      "Stamped.io credentials are required: STAMPED_STORE_HASH, STAMPED_USERNAME, STAMPED_PASSWORD"
    );
  }

  const startTime = performance.now();
  
  try {
    const params = buildParams(options);
    const url = `${STAMPED_CONFIG.baseURL}/${STAMPED_CONFIG.storeHash}/dashboard/reviews?${params}`;

    console.log("Stamped API: Making request to:", url);
    console.log("Stamped API: With headers:", getAuthHeaders());
    console.log("Stamped API: Request started at:", new Date().toISOString());

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(60_000),
    });

    const duration = performance.now() - startTime;
    console.log("Stamped API: Response status:", response.status);
    console.log("Stamped API: Request completed in:", `${duration.toFixed(2)}ms`);
    console.log("Stamped API: Response received at:", new Date().toISOString());
    console.log("Stamped API: Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Stamped API: Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Stamped API: Raw response data:", data);
    console.log("Stamped API: Pagination in response:", data.pagination);
    console.log("Stamped API: Full response structure:", Object.keys(data));

    return {
      data: parseReviewsData(data),
      pagination: data.pagination,
    };
  } catch (error) {
    console.error("Stamped API error:", error);
    throw new Error(
      `Failed to fetch reviews: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

// For backward compatibility
export const stampedAPI = { getReviews };