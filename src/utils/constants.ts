export const TESTIMONIAL_CONSTANTS = {
  API_TIMEOUT: 30_000,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  DEFAULT_LIMIT: 20, // Fetch 20 from Stamped API for filtering
  REVIEWS_PER_PAGE: 13, // Limit to 13 text reviews per page for 3:1 ratio with videos
  VIDEOS_PER_PAGE: 3, // First page gets 3 videos for 9 reviews (3:1 ratio)
  VIDEO_LOAD_TIMEOUT: 3_000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1_000,
  DEBOUNCE_DELAY: 300,
} as const;

export const AVATAR_COLORS = [
  "bg-blue-500 text-white",
  "bg-green-500 text-white",
  "bg-purple-500 text-white",
  "bg-red-500 text-white",
  "bg-yellow-500 text-white",
  "bg-pink-500 text-white",
  "bg-indigo-500 text-white",
  "bg-teal-500 text-white",
] as const;