"use client";

import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from "react";

interface VideoContextType {
  unmutedVideoId: string | null;
  setUnmutedVideoId: (id: string | null) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [unmutedVideoId, setUnmutedVideoId] = useState<string | null>(null);

  // Memoize the setter to prevent unnecessary re-renders
  const memoizedSetUnmutedVideoId = useCallback((id: string | null) => {
    setUnmutedVideoId(id);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    unmutedVideoId,
    setUnmutedVideoId: memoizedSetUnmutedVideoId,
  }), [unmutedVideoId, memoizedSetUnmutedVideoId]);

  return (
    <VideoContext.Provider value={contextValue}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
}