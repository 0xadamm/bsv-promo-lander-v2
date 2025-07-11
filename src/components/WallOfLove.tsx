"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Star, VolumeX, Volume2 } from "lucide-react";
import Image from "next/image";

interface StampedReview {
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

function TestimonialCard({
  name,
  avatar,
  videoUrl,
  isVideo = false,
  testimonialText,
  rating,
  title,
  photos,
}: Omit<StampedReview, "date">) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Enhanced video loading with multiple fallback strategies
  useEffect(() => {
    if (videoRef.current && isVideo && videoUrl && !isLoaded) {
      const video = videoRef.current;
      let timeoutId: NodeJS.Timeout;

      const handleLoadedMetadata = () => {
        // Multiple seek attempts for better compatibility
        video.currentTime = 0.1;

        // Fallback timeout if seeking fails
        timeoutId = setTimeout(() => {
          video.currentTime = 0.01;
          setTimeout(() => {
            setIsLoaded(true);
          }, 100);
        }, 500);
      };

      const handleSeeked = () => {
        clearTimeout(timeoutId);
        setIsLoaded(true);
      };

      const handleCanPlay = () => {
        if (!isLoaded) {
          setIsLoaded(true);
        }
      };

      const handleLoadedData = () => {
        if (!isLoaded) {
          setIsLoaded(true);
        }
      };

      const handleError = () => {
        clearTimeout(timeoutId);
        setVideoError(true);
        setIsLoaded(true);
      };

      // Add multiple event listeners for better compatibility
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("seeked", handleSeeked);
      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("error", handleError);

      // Force load with timeout fallback
      video.load();

      // Fallback timeout in case nothing works
      const fallbackTimeout = setTimeout(() => {
        if (!isLoaded) {
          setIsLoaded(true);
        }
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(fallbackTimeout);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("seeked", handleSeeked);
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("error", handleError);
      };
    }
  }, [isVideo, videoUrl, isLoaded]);

  const handleVideoClick = (e: React.MouseEvent) => {
    if (isVideo && videoRef.current) {
      e.preventDefault();
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleMuteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isVideo && videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColors = (name: string) => {
    const colors = [
      "bg-blue-500 text-white",
      "bg-green-500 text-white",
      "bg-purple-500 text-white",
      "bg-red-500 text-white",
      "bg-yellow-500 text-white",
      "bg-pink-500 text-white",
      "bg-indigo-500 text-white",
      "bg-teal-500 text-white",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.random() * 0.2 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-gray-300 break-inside-avoid mb-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-10 h-10 flex-shrink-0">
          {avatar && avatar !== "/images/avatars/placeholder.jpg" ? (
            <Image
              src={avatar}
              alt={`${name} avatar`}
              fill
              className="rounded-full object-cover"
              sizes="40px"
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${getAvatarColors(
                name
              )}`}
            >
              {getInitials(name)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h3 className="font-bold text-gray-900 text-sm truncate">{name}</h3>
          </div>
        </div>
      </div>

      {/* Rating Stars - Only show for non-video testimonials */}
      {!isVideo && rating && (
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={`${
                i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
              }`}
            />
          ))}
        </div>
      )}

      {/* Review Title - Don't show for video testimonials */}
      {!isVideo && title && (
        <h4 className="font-semibold text-gray-900 text-sm mb-2">{title}</h4>
      )}

      {/* Review Text - Only show if not a video or if there's text content */}
      {!isVideo && testimonialText && (
        <div className="mb-3">
          <p className="text-gray-900 text-sm leading-relaxed">
            {testimonialText}
          </p>
        </div>
      )}

      {/* Review Photos */}
      {photos && photos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {photos.slice(0, 4).map((photo, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={photo}
                alt={`Review photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* Video Section (if applicable) */}
      {isVideo && videoUrl && (
        <div
          className="relative mb-3 rounded-xl overflow-hidden border border-gray-200 cursor-pointer group"
          onClick={handleVideoClick}
        >
          <video
            ref={videoRef}
            className="w-full aspect-[9/16] object-cover"
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            poster=""
            webkit-playsinline="true"
            x-webkit-airplay="allow"
            controlsList="nodownload nofullscreen noremoteplaybook"
            disablePictureInPicture
            autoPlay={false}
            controls={false}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onError={() => setVideoError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
          </video>

          {/* Loading placeholder */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
              <div className="text-gray-500 text-sm">Loading...</div>
            </div>
          )}

          {/* Error fallback */}
          {videoError && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center rounded-xl">
              <div className="text-white text-center">
                <Play size={48} className="mx-auto mb-2 opacity-50" />
                <div className="text-sm opacity-75">Video Preview</div>
              </div>
            </div>
          )}

          {/* Play button overlay - only show when not playing */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:bg-black/80">
                <Play
                  size={20}
                  className="text-white translate-x-0.5"
                  fill="currentColor"
                />
              </div>
            </div>
          )}

          {/* Mute button */}
          <button
            onClick={handleMuteClick}
            className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 transition-colors z-10"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function WallOfLove() {
  const sectionRef = useRef<HTMLElement>(null);
  const [reviews, setReviews] = useState<StampedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  // Fetch reviews and videos
  useEffect(() => {
    const fetchReviewsAndVideos = async () => {
      try {
        setLoading(true);
        console.log("WallOfLove: Starting to fetch reviews and videos...");

        let allTestimonials: StampedReview[] = [];

        // Fetch videos first (they work reliably)
        try {
          const videosResponse = await fetch("/api/videos");
          console.log(
            "WallOfLove: Videos API response status:",
            videosResponse.status
          );

          if (videosResponse.ok) {
            const videosData = await videosResponse.json();
            console.log("WallOfLove: Videos data:", videosData);

            if (videosData.success) {
              console.log(
                "WallOfLove: Successfully got videos:",
                videosData.data.length,
                "videos"
              );
              allTestimonials = [...allTestimonials, ...videosData.data];
            }
          }
        } catch (videoError) {
          console.error("WallOfLove: Error fetching videos:", videoError);
        }

        // Fetch reviews with timeout handling (page 1 only initially)
        try {
          const reviewsResponse = await fetch(
            "/api/reviews?type=recent&limit=57&page=1",
            {
              signal: AbortSignal.timeout(65000), // 65 second timeout
            }
          );
          console.log(
            "WallOfLove: Reviews API response status:",
            reviewsResponse.status
          );

          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            console.log("WallOfLove: Reviews data:", reviewsData);

            if (reviewsData.success) {
              console.log(
                "WallOfLove: Successfully got reviews:",
                reviewsData.data.length,
                "reviews"
              );
              console.log("WallOfLove: First review:", reviewsData.data[0]);
              allTestimonials = [...allTestimonials, ...reviewsData.data];
            }
          }
        } catch (reviewError) {
          console.error(
            "WallOfLove: Error fetching reviews (continuing with videos only):",
            reviewError
          );
        }

        console.log(
          "WallOfLove: Total testimonials before shuffle:",
          allTestimonials.length
        );

        // Shuffle the combined testimonials for variety
        const shuffledTestimonials = allTestimonials.sort(
          () => Math.random() - 0.5
        );
        setReviews(shuffledTestimonials);

        // Don't show error if we have videos, even if reviews failed
        if (allTestimonials.length === 0) {
          throw new Error("No testimonials found");
        }
      } catch (err) {
        console.error("WallOfLove: Error fetching testimonials:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load testimonials"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsAndVideos();
  }, []);

  // Load more reviews function
  const loadMoreReviews = async () => {
    if (loadingMore || !hasMorePages) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      console.log(`WallOfLove: Loading page ${nextPage}...`);

      const reviewsResponse = await fetch(
        `/api/reviews?type=recent&limit=57&page=${nextPage}`,
        {
          signal: AbortSignal.timeout(65000),
        }
      );

      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();

        if (reviewsData.success && reviewsData.data.length > 0) {
          console.log(
            `WallOfLove: Page ${nextPage} loaded ${reviewsData.data.length} reviews`
          );

          // Append new reviews to existing ones
          setReviews((prevReviews) => [...prevReviews, ...reviewsData.data]);
          setCurrentPage(nextPage);

          // Check if we've reached the last page (3 total pages)
          if (nextPage >= 3) {
            setHasMorePages(false);
          }
        } else {
          console.log(
            `WallOfLove: Page ${nextPage} returned no data, reached end`
          );
          setHasMorePages(false);
        }
      }
    } catch (error) {
      console.error("WallOfLove: Error loading more reviews:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const testimonials = reviews;

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-20 lg:py-16 bg-gray-50"
    >
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            Wall of Love
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our customers are saying about us
          </p>
          <a
            href="https://bluescorpion.com/products/pain-and-inflammation-relief"
            className="inline-flex items-center mt-6 text-brand-primary hover:text-brand-accent transition-colors duration-200"
          >
            Visit our website →
          </a>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Failed to load reviews from Stamped.io
            </p>
            <p className="text-gray-600 text-sm">
              Showing sample reviews instead
            </p>
          </div>
        )}

        {/* Masonry Grid */}
        {!loading && (
          <>
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} {...testimonial} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMorePages && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMoreReviews}
                  disabled={loadingMore}
                  className="inline-flex items-center px-8 py-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-accent transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading More...
                    </>
                  ) : (
                    "Load More Reviews"
                  )}
                </button>
              </div>
            )}

            {/* All Reviews Loaded Message */}
            {!hasMorePages && testimonials.length > 0 && (
              <div className="text-center mt-12">
                <p className="text-gray-500 font-medium">
                  🎉 You&apos;ve seen all our amazing reviews!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
