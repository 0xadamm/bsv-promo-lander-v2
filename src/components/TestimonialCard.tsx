"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { VideoPlayer } from "./VideoPlayer";
import { AVATAR_COLORS } from "@/utils/constants";
import type { StampedReview } from "@/services/testimonialService";

type TestimonialCardProps = Omit<StampedReview, "date">;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColors(name: string): string {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function TestimonialCard({
  name,
  avatar,
  videoUrl,
  isVideo = false,
  testimonialText,
  rating,
  title,
  photos,
}: TestimonialCardProps) {
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

      {/* Video Section */}
      {isVideo && videoUrl && (
        <VideoPlayer videoUrl={videoUrl} className="mb-3" />
      )}
    </motion.div>
  );
}