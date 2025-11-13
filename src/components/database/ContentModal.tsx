import { useEffect } from "react";
import { Content, Sport, Ailment } from "@/types/database";
import TagBadge from "./TagBadge";

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
  const contentSports = sports.filter((s) => content.sports.includes(s.slug));
  const contentAilments = ailments.filter((a) =>
    content.ailments.includes(a.slug)
  );

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
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
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3"
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
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3"
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
      <div className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden flex flex-col lg:flex-row">
        {/* Media Section */}
        <div className="lg:w-2/3 bg-black flex items-center justify-center p-4">
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
        </div>

        {/* Info Section */}
        <div className="lg:w-1/3 p-6 overflow-y-auto">
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

          {/* Metadata */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
            {content.source && (
              <div className="mb-2">
                <span className="font-medium">Source:</span> {content.source}
              </div>
            )}
            <div>
              <span className="font-medium">Published:</span>{" "}
              {new Date(content.publishedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
