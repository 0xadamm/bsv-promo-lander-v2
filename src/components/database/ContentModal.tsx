import { useEffect, useState } from "react";
import { Content, Sport, Ailment } from "@/types/database";
import TagBadge from "./TagBadge";
import { getVideoDimensions } from "@/utils/videoUtils";

interface ContentModalProps {
  content: Content;
  sports: Sport[];
  ailments: Ailment[];
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export default function ContentModal({
  content,
  sports,
  ailments,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: ContentModalProps) {
  const [actualIsPortrait, setActualIsPortrait] = useState<boolean | null>(null);

  const contentSports = sports.filter((s) => content.sports.includes(s.slug));
  const contentAilments = ailments.filter((a) =>
    content.ailments.includes(a.slug)
  );

  // Detect actual video orientation from metadata
  useEffect(() => {
    if (content.mediaType === "video" && content.mediaUrls[0]) {
      getVideoDimensions(content.mediaUrls[0]).then(({ isPortrait }) => {
        setActualIsPortrait(isPortrait);
      });
    }
  }, [content.mediaUrls, content.mediaType]);

  // Use actual video dimensions when available, fallback to filename detection
  const isPortrait = actualIsPortrait ?? (
    content.mediaUrls[0]?.match(/(portrait|vertical|9-?16|story|916)/i) ||
    content.title.match(/(portrait|vertical|story)/i)
  );

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const url = content.mediaUrls[0];

      // Extract filename from URL or use content title
      const urlParts = url.split('/');
      let filename = urlParts[urlParts.length - 1];

      // Clean up filename and ensure it has proper extension
      if (!filename || filename.includes('?')) {
        const extension = content.mediaType === 'video' ? 'mp4' : 'jpg';
        filename = `${content.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${extension}`;
      }

      // Use fetch with cors mode to download
      const response = await fetch(url, { mode: 'cors' });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();

      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL after a short delay
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab if download fails
      window.open(content.mediaUrls[0], '_blank');
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext && onNext) onNext();
      if (e.key === "ArrowLeft" && hasPrevious && onPrevious) onPrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose, onNext, onPrevious, hasNext, hasPrevious]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close modal"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Navigation Buttons */}
      {hasPrevious && onPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 z-50"
          aria-label="Previous content"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {hasNext && onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 z-50"
          aria-label="Next content"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Modal Content */}
      {isPortrait ? (
        // Professional borderless layout for vertical videos - UX optimized
        <div
          className="flex flex-col items-center min-w-[280px] max-w-[500px] px-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Unified Card Container - seamless video + details */}
          <div className="rounded-xl overflow-hidden shadow-2xl">
            {/* Video Container */}
            <div className="relative bg-black">
              {content.mediaType === "video" && content.mediaUrls[0] && (
                <video
                  src={content.mediaUrls[0]}
                  controls
                  autoPlay
                  className="h-auto object-contain"
                  style={{ maxHeight: '65vh' }}
                />
              )}
              {content.mediaType === "image" && content.mediaUrls[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={content.mediaUrls[0]}
                  alt={content.title}
                  className="h-auto object-contain"
                  style={{ maxHeight: '65vh' }}
                />
              )}

              {/* Content Type Badge - overlay on video */}
              <div className="absolute top-3 left-3 z-10">
                <span
                  className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
                    content.contentType === "testimonial"
                      ? "bg-blue-600/90 text-white"
                      : "bg-purple-600/90 text-white"
                  }`}
                >
                  {content.contentType === "testimonial"
                    ? "Testimonial"
                    : content.contentType === "raw-footage"
                    ? "Raw Footage"
                    : content.contentType === "doctors"
                    ? "Doctors"
                    : content.contentType === "athlete"
                    ? "Athletes"
                    : "Content"}
                </span>
              </div>
            </div>

            {/* Details Card - seamlessly connected */}
            <div className="w-full bg-white/95 backdrop-blur-sm p-5 max-h-[22vh] overflow-y-auto">
            {/* Header with download button */}
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 leading-tight flex-1 pr-2">
                {content.title}
              </h2>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="flex items-center justify-center w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 hover:scale-105 shrink-0"
                title={`Download ${content.mediaType === "video" ? "video" : "image"}`}
              >
                <svg
                  className="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>

            {content.description && (
              <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                {content.description}
              </p>
            )}

            {/* Tags */}
            {(contentSports.length > 0 || contentAilments.length > 0) && (
              <div className="space-y-2.5 pt-2 border-t border-gray-200">
                {contentSports.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Sports
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {contentSports.map((sport) => (
                        <TagBadge
                          key={sport.slug}
                          name={sport.name}
                          color={sport.color || "#3B82F6"}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {contentAilments.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Ailments
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {contentAilments.map((ailment) => (
                        <TagBadge
                          key={ailment.slug}
                          name={ailment.name}
                          color={ailment.color || "#8B5CF6"}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      ) : (
        // Original layout for horizontal content
        <div
          className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-lg overflow-hidden flex flex-col lg:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Media Section */}
          <div className="relative bg-black flex items-center justify-center p-4 lg:w-2/3">
            {content.mediaType === "video" && content.mediaUrls[0] && (
              <video
                src={content.mediaUrls[0]}
                controls
                autoPlay
                className="max-w-full max-h-[60vh] lg:max-h-[80vh]"
              />
            )}
            {content.mediaType === "image" && content.mediaUrls[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.mediaUrls[0]}
                alt={content.title}
                className="max-w-full max-h-[60vh] lg:max-h-[80vh] object-contain"
              />
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="absolute top-3 right-3 flex items-center justify-center w-10 h-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full transition-all duration-200 hover:scale-110"
              title={`Download ${content.mediaType === "video" ? "video" : "image"}`}
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          </div>

          {/* Info Section */}
          <div className="p-6 overflow-y-auto lg:w-1/3">
          {/* Content Type Badge */}
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${
              content.contentType === "testimonial"
                ? "bg-blue-600 text-white"
                : "bg-purple-600 text-white"
            }`}
          >
            {content.contentType === "testimonial"
              ? "Testimonial"
              : content.contentType === "raw-footage"
              ? "Raw Footage"
              : content.contentType === "doctors"
              ? "Doctors"
              : content.contentType === "athlete"
              ? "Athletes"
              : "Content"}
          </span>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {content.title}
          </h2>

          {content.description && (
            <p className="text-gray-700 mb-6 whitespace-pre-wrap">
              {content.description}
            </p>
          )}

          {/* Tags */}
          {(contentSports.length > 0 || contentAilments.length > 0) && (
            <div className="space-y-4">
              {contentSports.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Sports
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {contentSports.map((sport) => (
                      <TagBadge
                        key={sport.slug}
                        name={sport.name}
                        color={sport.color || "#3B82F6"}
                        size="md"
                      />
                    ))}
                  </div>
                </div>
              )}

              {contentAilments.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Ailments
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {contentAilments.map((ailment) => (
                      <TagBadge
                        key={ailment.slug}
                        name={ailment.name}
                        color={ailment.color || "#8B5CF6"}
                        size="md"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
