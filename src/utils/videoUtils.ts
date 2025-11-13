/**
 * Utility functions for video processing and metadata extraction
 */

export interface VideoDimensions {
  width: number;
  height: number;
  isPortrait: boolean;
}

/**
 * Detects video dimensions and orientation from video metadata
 * Falls back to filename-based detection if metadata loading fails
 *
 * @param videoUrl - URL of the video file
 * @returns Promise with video dimensions and orientation
 */
export async function getVideoDimensions(videoUrl: string): Promise<VideoDimensions> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.preload = 'metadata';

    // Set a timeout in case video never loads
    const timeout = setTimeout(() => {
      // Fallback to filename detection
      const isPortrait = videoUrl.match(/[_-](portrait|vertical|9x16|916)[_.-]/i) !== null;
      resolve({ width: 0, height: 0, isPortrait });
      video.remove();
    }, 3000); // 3 second timeout

    video.addEventListener('loadedmetadata', () => {
      clearTimeout(timeout);

      const width = video.videoWidth;
      const height = video.videoHeight;
      const isPortrait = height > width;

      resolve({ width, height, isPortrait });
      video.remove();
    });

    video.addEventListener('error', () => {
      clearTimeout(timeout);

      // Fallback to filename detection if video fails to load
      const isPortrait = videoUrl.match(/[_-](portrait|vertical|9x16|916)[_.-]/i) !== null;
      resolve({ width: 0, height: 0, isPortrait });
      video.remove();
    });

    video.load();
  });
}
