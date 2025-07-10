"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Instagram,
  ExternalLink,
  Play,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
} from "lucide-react";
import { instagramPosts } from "@/lib/data";

interface InstagramPostProps {
  post: {
    id: string;
    image: string;
    url: string;
    alt: string;
  };
  index: number;
}

function InstagramPost({ post, index }: InstagramPostProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Static engagement numbers to avoid hydration mismatch
  const engagementData = [
    { likes: 3247, comments: 156 },
    { likes: 1892, comments: 87 },
    { likes: 4521, comments: 203 },
    { likes: 2156, comments: 142 },
    { likes: 3891, comments: 178 },
    { likes: 2743, comments: 91 },
  ];

  const { likes, comments } = engagementData[index] || engagementData[0];

  // Determine if this should look like a video post
  const isVideoPost = index % 3 === 0; // Every 3rd post looks like a video

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-[9/16] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full relative"
        aria-label={`View Instagram post: ${post.alt}`}
      >
        {/* Main Image */}
        <img
          src={post.image}
          alt={post.alt}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Video overlay for video-style posts */}
        {isVideoPost && (
          <div className="absolute inset-0 bg-black/10">
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`
                bg-black/50 backdrop-blur-sm rounded-full p-3 transform transition-all duration-300
                ${isHovered ? "scale-110 bg-black/70" : "scale-100"}
              `}
              >
                <Play
                  size={24}
                  className="text-white ml-0.5"
                  fill="currentColor"
                />
              </div>
            </div>

            {/* Video duration badge */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              {[45, 72, 38, 91, 56, 63][index] || 45}s
            </div>
          </div>
        )}

        {/* Instagram Stories-style ring */}
        <div className="absolute inset-0 rounded-xl">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-full h-full bg-black rounded-xl"></div>
          </div>
        </div>

        {/* Engagement overlay */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent
          transition-opacity duration-300
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        >
          {/* Top overlay with Instagram branding */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">BS</span>
                  </div>
                </div>
                <span className="text-white text-sm font-semibold">
                  bluescorpion
                </span>
              </div>
              <Instagram size={20} className="text-white" />
            </div>
          </div>

          {/* Bottom overlay with engagement */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="space-y-3">
              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Heart
                    size={24}
                    className="text-white hover:text-red-500 transition-colors"
                  />
                  <MessageCircle
                    size={24}
                    className="text-white hover:text-blue-400 transition-colors"
                  />
                  <Send
                    size={24}
                    className="text-white hover:text-blue-400 transition-colors"
                  />
                </div>
                <Bookmark
                  size={24}
                  className="text-white hover:text-yellow-400 transition-colors"
                />
              </div>

              {/* Engagement stats */}
              <div className="space-y-1">
                <div className="text-white text-sm font-semibold">
                  {likes.toLocaleString()} likes
                </div>
                {comments > 0 && (
                  <div className="text-gray-300 text-sm">
                    View all {comments} comments
                  </div>
                )}
              </div>

              {/* Caption preview */}
              <div className="text-white text-sm">
                <span className="font-semibold">bluescorpion</span>{" "}
                <span className="text-gray-200">
                  {isVideoPost
                    ? "End your pain with Blue Scorpion! ✨"
                    : "Pain relief that works 💫"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* External link indicator */}
        <div className="absolute top-3 left-3 bg-black/60 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ExternalLink size={12} className="text-white" />
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </a>
    </div>
  );
}

export default function InstagramLinks() {
  const sectionRef = useRef<HTMLElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section
      id="instagram"
      ref={sectionRef}
      className="py-16 lg:py-24 bg-gradient-to-b from-brand-light to-white"
    >
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-primary mb-4">
            Follow Our Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            See real pain relief stories and get inspired by our
            community&apos;s incredible results on Instagram
          </p>
          <div className="flex items-center justify-center space-x-2 text-brand-primary">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-[2px]">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Instagram size={14} className="text-brand-primary" />
              </div>
            </div>
            <span className="font-semibold">@bluescorpion</span>
          </div>
        </motion.div>

        {/* Instagram Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6"
        >
          {instagramPosts.map((post, index) => (
            <motion.div key={post.id} variants={itemVariants}>
              <InstagramPost post={post} index={index} />
            </motion.div>
          ))}
        </motion.div>

        {/* Instagram-style Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-12 border-t border-gray-200 text-center"
        >
          <div className="flex flex-col items-center">
            <div className="text-2xl lg:text-3xl font-bold text-brand-primary mb-2">
              50K+
            </div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl lg:text-3xl font-bold text-brand-primary mb-2">
              2.1M
            </div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl lg:text-3xl font-bold text-brand-primary mb-2">
              1.2K
            </div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl lg:text-3xl font-bold text-brand-primary mb-2">
              95%
            </div>
            <div className="text-sm text-gray-600">Engagement</div>
          </div>
        </motion.div>

        {/* Follow Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://instagram.com/bluescorpion"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Instagram size={24} />
            <span>Follow @bluescorpion</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
