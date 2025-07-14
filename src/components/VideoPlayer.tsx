"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, VolumeX, Volume2 } from "lucide-react";
import { TESTIMONIAL_CONSTANTS } from "@/utils/constants";

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
  videoId?: string;
  unmutedVideoId?: string | null;
  setUnmutedVideoId?: (id: string | null) => void;
}

export function VideoPlayer({ 
  videoUrl, 
  className = "", 
  videoId, 
  unmutedVideoId, 
  setUnmutedVideoId 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  // Use shared muted state if available, otherwise default to muted
  const isMuted = videoId && unmutedVideoId !== undefined ? unmutedVideoId !== videoId : true;
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl || isLoaded) return;

    const handleLoadedMetadata = () => {
      video.currentTime = 0.1;
      timeoutRef.current = setTimeout(() => {
        video.currentTime = 0.01;
        setTimeout(() => setIsLoaded(true), 100);
      }, 500);
    };

    const handleSeeked = () => {
      cleanup();
      setIsLoaded(true);
    };

    const handleCanPlay = () => {
      if (!isLoaded) setIsLoaded(true);
    };

    const handleError = () => {
      cleanup();
      setVideoError(true);
      setIsLoaded(true);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    video.load();

    fallbackTimeoutRef.current = setTimeout(() => {
      if (!isLoaded) setIsLoaded(true);
    }, TESTIMONIAL_CONSTANTS.VIDEO_LOAD_TIMEOUT);

    return () => {
      cleanup();
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [videoUrl, isLoaded, cleanup]);

  // Update video muted state when unmutedVideoId changes
  useEffect(() => {
    if (videoRef.current && videoId) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, videoId]);

  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => setVideoError(true));
    }
  }, [isPlaying]);

  const handleMuteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !videoId || !setUnmutedVideoId) return;

    if (isMuted) {
      // Unmute this video and mute all others
      setUnmutedVideoId(videoId);
      video.muted = false;
    } else {
      // Mute this video
      setUnmutedVideoId(null);
      video.muted = true;
    }
  }, [isMuted, videoId, setUnmutedVideoId]);

  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);
  const handleEnded = useCallback(() => setIsPlaying(false), []);

  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-gray-200 cursor-pointer group ${className}`}
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
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
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

      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading...</div>
        </div>
      )}

      {videoError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center rounded-xl">
          <div className="text-white text-center">
            <Play size={48} className="mx-auto mb-2 opacity-50" />
            <div className="text-sm opacity-75">Video Preview</div>
          </div>
        </div>
      )}

      {!isPlaying && !videoError && (
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

      <button
        onClick={handleMuteClick}
        className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 transition-colors z-10"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        type="button"
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
}