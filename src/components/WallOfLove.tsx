"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Star, Calendar } from "lucide-react";
import Image from "next/image";
import { videoTestimonials } from "@/lib/data";

interface TestimonialCardProps {
  thumbnailImage: string;
  name: string;
  title: string;
  avatar: string;
  duration?: string;
  videoUrl?: string;
  isVideo?: boolean;
  testimonialText: string;
  date: string;
  platform?: "twitter" | "linkedin" | "facebook" | "google" | "custom";
}

function TestimonialCard({
  thumbnailImage,
  name,
  title,
  avatar,
  duration,
  videoUrl,
  isVideo = false,
  testimonialText,
  date,
  platform = "custom",
}: TestimonialCardProps) {
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

  const getPlatformIcon = () => {
    switch (platform) {
      case "twitter":
        return "𝕏";
      case "linkedin":
        return "in";
      case "facebook":
        return "f";
      case "google":
        return "G";
      default:
        return "★";
    }
  };

  const getPlatformColor = () => {
    switch (platform) {
      case "twitter":
        return "bg-black text-white";
      case "linkedin":
        return "bg-blue-600 text-white";
      case "facebook":
        return "bg-blue-500 text-white";
      case "google":
        return "bg-red-500 text-white";
      default:
        return "bg-brand-primary text-white";
    }
  };

  // Generate random rating (4-5 stars for testimonials)
  const rating = Math.random() > 0.3 ? 5 : 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.random() * 0.2 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 break-inside-avoid mb-6"
    >
      {/* Video Section (if applicable) */}
      {isVideo && videoUrl && (
        <div className="relative mb-4 rounded-xl overflow-hidden">
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

      {/* Profile Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative w-12 h-12">
          <Image
            src={avatar}
            alt={`${name} avatar`}
            fill
            className="rounded-full object-cover border-2 border-gray-100"
            sizes="48px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {name}
            </h3>
            <div
              className={`w-5 h-5 rounded text-xs flex items-center justify-center font-bold ${getPlatformColor()}`}
            >
              {getPlatformIcon()}
            </div>
          </div>
          <p className="text-gray-600 text-xs leading-relaxed">{title}</p>
        </div>
      </div>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-3">
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

      {/* Testimonial Text */}
      <blockquote className="text-gray-800 text-sm leading-relaxed mb-4">
        &ldquo;{testimonialText}&rdquo;
      </blockquote>

      {/* Date */}
      <div className="flex items-center gap-1 text-gray-500 text-xs">
        <Calendar size={12} />
        <span>{date}</span>
      </div>
    </motion.div>
  );
}

export default function WallOfLove() {
  const sectionRef = useRef<HTMLElement>(null);

  // Generate sample testimonial data
  const testimonials = videoTestimonials.map((testimonial, index) => ({
    ...testimonial,
    testimonialText: [
      "Blue Scorpion completely eliminated my chronic pain! I felt relief in just hours. After 2 weeks, I'm pain-free for the first time in years.",
      "As an athlete, I deal with constant joint pain. Blue Scorpion changed everything. My knees feel 20 years younger!",
      "The anti-inflammatory formula is pure magic. Friends keep asking how I'm so active again - Blue Scorpion gave me my life back!",
      "I've tried countless pain relief products. Blue Scorpion is the only one that actually delivered lasting results. Incredible relief!",
      "The fast absorption, long-lasting relief, amazing results - everything about Blue Scorpion is perfect. Worth every penny!",
      "My doctor was amazed at my mobility improvement. Blue Scorpion is now a permanent part of my pain management routine.",
      "From day one, Blue Scorpion has made a noticeable difference in how I approach my daily activities. It's brilliantly effective.",
      "One of the most powerful pain relief solutions I've ever used. Blue Scorpion makes managing chronic pain so much easier.",
    ][index % 8],
    date: [
      "Oct 30, 2024",
      "Oct 25, 2024",
      "Oct 20, 2024",
      "Oct 15, 2024",
      "Oct 10, 2024",
      "Oct 5, 2024",
      "Sep 30, 2024",
      "Sep 25, 2024",
    ][index % 8],
    platform: (
      ["twitter", "linkedin", "facebook", "google", "custom"] as const
    )[index % 5],
    isVideo: index % 4 === 0, // Every 4th card is a video
  }));

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
            See what our customers are saying about us
          </p>
          <a
            href="#order"
            className="inline-flex items-center mt-6 text-brand-primary hover:text-brand-accent transition-colors duration-200"
          >
            Visit our website →
          </a>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              thumbnailImage={testimonial.thumbnailImage}
              name={testimonial.name}
              title={testimonial.title}
              avatar={testimonial.avatar}
              duration={testimonial.duration}
              videoUrl={testimonial.videoUrl}
              isVideo={testimonial.isVideo}
              testimonialText={testimonial.testimonialText}
              date={testimonial.date}
              platform={testimonial.platform}
            />
          ))}
        </div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="bg-brand-primary hover:bg-brand-accent text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
            Load more
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
