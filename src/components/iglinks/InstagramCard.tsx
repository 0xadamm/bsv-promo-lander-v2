"use client";

import { useState, useRef, useEffect } from "react";
import {
  ExternalLink,
  Play,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  VolumeX,
  Volume2,
} from "lucide-react";
import Image from "next/image";

interface InstagramPost {
  id: string;
  image: string;
  url: string;
  alt: string;
}

interface InstagramCardProps {
  post: InstagramPost;
  index: number;
  unmutedVideoId: string | null;
  setUnmutedVideoId: (id: string | null) => void;
}

export default function InstagramCard({ post, index, unmutedVideoId, setUnmutedVideoId }: InstagramCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Check if this post has a video URL (mp4)
  const hasVideoUrl = post.url.includes('.mp4');
  
  // Check if this video is the currently unmuted one
  const isMuted = unmutedVideoId !== post.id;

  // Update video muted state when unmutedVideoId changes
  useEffect(() => {
    if (videoRef.current && hasVideoUrl) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, hasVideoUrl]);

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
  
  const handleVideoClick = (e: React.MouseEvent) => {
    if (hasVideoUrl) {
      e.preventDefault();
      if (isPlaying) {
        videoRef.current?.pause();
        setIsPlaying(false);
      } else {
        videoRef.current?.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMuteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVideoUrl && videoRef.current) {
      if (isMuted) {
        // Unmute this video and mute all others
        setUnmutedVideoId(post.id);
        videoRef.current.muted = false;
      } else {
        // Mute this video
        setUnmutedVideoId(null);
        videoRef.current.muted = true;
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-[9/16] cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={hasVideoUrl ? "#" : post.url}
        target={hasVideoUrl ? "_self" : "_blank"}
        rel="noopener noreferrer"
        className="block w-full h-full relative"
        aria-label={`View Instagram post: ${post.alt}`}
        onClick={handleVideoClick}
      >
        {/* Main Image */}
        <Image
          src={post.image}
          alt={post.alt}
          fill
          onLoad={() => setIsLoaded(true)}
          className={`object-cover transition-all duration-500 group-hover:scale-110 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
        />

        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Video element for posts with video URLs */}
        {hasVideoUrl && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-20"
            muted={isMuted}
            loop
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={post.url} type="video/mp4" />
          </video>
        )}

        {/* Video overlay for ALL video posts */}
        {hasVideoUrl && (
          <div className="absolute inset-0 z-30">
            {/* Play button overlay - hide when video is playing */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`
                  w-16 h-16 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 shadow-lg
                  ${isHovered ? "scale-110 bg-black/80" : "scale-100"}
                `}
                >
                  <Play
                    size={20}
                    className="text-white translate-x-0.5"
                    fill="currentColor"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mute button for all video posts */}
        {hasVideoUrl && (
          <button
            onClick={handleMuteClick}
            className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 transition-colors z-30"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        )}

        {/* Instagram Stories-style ring */}
        <div className="absolute inset-0 rounded-xl">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-full h-full bg-black rounded-xl"></div>
          </div>
        </div>

        {/* Engagement overlay - always visible and transparent */}
        <div className="absolute inset-0 z-25">
          {/* Top overlay with branding */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/40 to-transparent p-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/blue-scorpion-venom-logo.png"
                    alt="Blue Scorpion Logo"
                    width={24}
                    height={24}
                    className="w-5 h-5 object-contain"
                  />
                </div>
              </div>
              <span className="text-white text-sm font-semibold ml-2">
                bluescorpionvenom
              </span>
            </div>
          </div>

          {/* Bottom overlay with simplified content */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-4">
            <div className="space-y-3">
              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Heart
                    size={24}
                    className="text-red-500 hover:text-red-400 transition-colors"
                    fill="currentColor"
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