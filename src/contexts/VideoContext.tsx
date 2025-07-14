"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface VideoContextType {
  unmutedVideoId: string | null;
  setUnmutedVideoId: (id: string | null) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [unmutedVideoId, setUnmutedVideoId] = useState<string | null>(null);

  return (
    <VideoContext.Provider value={{ unmutedVideoId, setUnmutedVideoId }}>
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