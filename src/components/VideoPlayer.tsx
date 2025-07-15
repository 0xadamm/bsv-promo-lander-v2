"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Play, VolumeX, Volume2 } from "lucide-react";

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
  
  // Memoize muted state calculation
  const isMuted = useMemo(() => 
    videoId && unmutedVideoId !== undefined ? unmutedVideoId !== videoId : true, 
    [videoId, unmutedVideoId]
  );
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simplified cleanup function
  const cleanup = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, []);

  // Simplified video loading logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl || isLoaded) return;

    const handleCanPlay = () => {
      cleanup();
      setIsLoaded(true);
    };

    const handleError = () => {
      cleanup();
      setVideoError(true);
      setIsLoaded(true);
    };

    // Only use essential event listeners
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    // Simplified loading with shorter timeout
    loadTimeoutRef.current = setTimeout(() => {
      if (!isLoaded) setIsLoaded(true);
    }, 2000);

    return () => {
      cleanup();
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [videoUrl, isLoaded, cleanup]);

  // Optimized muted state update
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoId) {
      video.muted = isMuted;
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