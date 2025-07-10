"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import Image from "next/image";
import { videoTestimonials } from "@/lib/data";

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
  thumbnailImage,
  name,
  avatar,
  duration,
  videoUrl,
  isVideo = false,
  testimonialText,
  date,
  rating,
  title,
  photos,
}: StampedReview) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (videoRef.current && isVideo) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
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
            <span className="text-gray-500 text-sm">{date}</span>
          </div>
        </div>
      </div>

      {/* Rating Stars */}
      {rating && (
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

      {/* Review Title */}
      {title && (
        <h4 className="font-semibold text-gray-900 text-sm mb-2">{title}</h4>
      )}

      {/* Review Text */}
      <div className="mb-3">
        <p className="text-gray-900 text-sm leading-relaxed">
          {testimonialText}
        </p>
      </div>

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
        <div className="relative mb-3 rounded-xl overflow-hidden border border-gray-200">
          <video
            ref={videoRef}
            className="w-full h-48 object-cover"
            poster={thumbnailImage}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            playsInline
            muted
          >
            <source src={videoUrl} type="video/mp4" />
          </video>

          {!isPlaying && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <button
                onClick={handlePlayClick}
                className="bg-white/95 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 transform hover:scale-110"
              >
                <Play
                  size={20}
                  className="text-gray-800 ml-0.5"
                  fill="currentColor"
                />
              </button>
            </div>
          )}

          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {duration}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function WallOfLove() {
  const sectionRef = useRef<HTMLElement>(null);
  const [reviews, setReviews] = useState<StampedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews from Stamped.io API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        console.log("WallOfLove: Starting to fetch reviews...");

        console.log("WallOfLove: Fetching reviews from Stamped API...");
        
        const response = await fetch("/api/reviews?type=recent&limit=20");
        console.log("WallOfLove: API response status:", response.status);

        const data = await response.json();
        console.log("WallOfLove: API response data:", data);

        if (data.success) {
          console.log("WallOfLove: Successfully got reviews:", data.data);
          setReviews(data.data);
        } else {
          console.error("WallOfLove: API returned error:", data.message);
          throw new Error(data.message || "Failed to fetch reviews");
        }
      } catch (err) {
        console.error("WallOfLove: Error fetching reviews:", err);
        setError(err instanceof Error ? err.message : "Failed to load reviews");

        // Fallback to mock data if API fails
        console.log("WallOfLove: Using fallback reviews");
        const fallbackReviews = videoTestimonials.map((testimonial, index) => ({
          id: testimonial.id,
          name: testimonial.name,
          avatar: "",
          testimonialText: [
            "Just tried Blue Scorpion and WOW! My chronic back pain is completely gone. Felt relief in just hours and after 2 weeks I'm pain-free for the first time in years!",
            "As an athlete in my 40s, I deal with constant joint pain. Blue Scorpion changed everything! My knees feel 20 years younger",
            "The anti-inflammatory formula is pure magic. Friends keep asking how I'm so active again - Blue Scorpion gave me my life back!",
            "I've tried countless pain relief products. Blue Scorpion is the only one that actually delivered lasting results. Incredible relief!",
            "The fast absorption, long-lasting relief, amazing results - everything about Blue Scorpion is perfect. Worth every penny!",
            "My doctor was amazed at my mobility improvement. Blue Scorpion is now a permanent part of my pain management routine",
          ][index % 6],
          date: ["2h", "4h", "1d", "2d", "3d", "5d"][index % 6],
          rating: Math.random() > 0.3 ? 5 : 4,
          title: [
            "Life-changing results!",
            "Finally found relief",
            "Amazing product",
            "Highly recommend",
            "Game changer",
            "Worth every penny",
          ][index % 6],
          verified: Math.random() > 0.5,
        }));
        setReviews(fallbackReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const testimonials = reviews;

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-20 lg:py-32 bg-gray-50"
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
            See what our customers are saying about us on 𝕏
          </p>
          <a
            href="#order"
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
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
            Load more posts
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16 pt-8 border-t border-gray-200"
        >
          <a
            href="https://bluescorpion.com"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors duration-200"
          >
            <div className="w-6 h-6 bg-brand-primary rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <span className="font-semibold">
              Collect testimonials with Blue Scorpion
            </span>
            →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
