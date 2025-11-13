import { Content, Sport, Ailment } from "@/types/database";
import TagBadge from "./TagBadge";

interface ContentCardProps {
  content: Content;
  sports: Sport[];
  ailments: Ailment[];
  onClick: () => void;
}

export default function ContentCard({
  content,
  sports,
  ailments,
  onClick,
}: ContentCardProps) {
  const contentSports = sports.filter((s) => content.sports.includes(s.slug));
  const contentAilments = ailments.filter((a) =>
    content.ailments.includes(a.slug)
  );

  // Check if thumbnailUrl is actually an image (not a video file)
  const isValidThumbnail =
    content.thumbnailUrl &&
    !content.thumbnailUrl.match(/\.(mp4|mov|avi|webm|mkv)$/i);

  // Detect orientation from filename or default to landscape
  // Common patterns: "portrait", "vertical", "9-16", "story", dimensions in name
  const isPortrait =
    content.mediaUrls[0]?.match(/(portrait|vertical|9-?16|story|916)/i) ||
    content.title.match(/(portrait|vertical|story)/i);

  // For images, we don't force aspect ratio - let them be natural
  // For videos, portrait is 9:16, landscape is 16:9
  const aspectRatioClass =
    content.mediaType === "image"
      ? ""
      : isPortrait
      ? "aspect-[9/16]"
      : "aspect-video";

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${aspectRatioClass}`}
    >
      {/* Background Media - Full Card */}
      {content.mediaType === "video" && content.mediaUrls[0] && (
        <>
          {isValidThumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={content.thumbnailUrl}
              alt={content.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <video
              src={content.mediaUrls[0]}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              preload="metadata"
              muted
              playsInline
            />
          )}
        </>
      )}

      {content.mediaType === "image" && content.mediaUrls[0] && (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.mediaUrls[0]}
            alt={content.title}
            className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {!content.mediaUrls[0] && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Dark Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Video Play Overlay */}
      {content.mediaType === "video" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 group-hover:scale-110 transition-transform">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Content Type Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
            content.contentType === "testimonial"
              ? "bg-blue-600/90 text-white"
              : "bg-purple-600/90 text-white"
          }`}
        >
          {content.contentType === "testimonial"
            ? "Testimonial"
            : "Raw Footage"}
        </span>
      </div>

      {/* Bottom Overlay - Title and Tags */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="font-bold text-white mb-2 line-clamp-2 drop-shadow-lg">
          {content.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {contentSports.map((sport) => (
            <TagBadge
              key={sport.slug}
              name={sport.name}
              color={sport.color || "#3B82F6"}
              size="sm"
            />
          ))}
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

      {/* Hover Overlay with Description */}
      {content.description && (
        <div className="absolute inset-0 bg-blue-600/95 backdrop-blur-sm text-white p-6 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <h3 className="font-bold text-xl mb-3">{content.title}</h3>
          <p className="text-sm text-white/90 line-clamp-6 mb-4">
            {content.description}
          </p>

          {/* Tags in hover state */}
          <div className="flex flex-wrap gap-2 mb-4">
            {contentSports.map((sport) => (
              <TagBadge
                key={sport.slug}
                name={sport.name}
                color={sport.color || "#3B82F6"}
                size="sm"
              />
            ))}
            {contentAilments.map((ailment) => (
              <TagBadge
                key={ailment.slug}
                name={ailment.name}
                color={ailment.color || "#8B5CF6"}
                size="sm"
              />
            ))}
          </div>

          <p className="text-xs text-white/70">Click to view full content</p>
        </div>
      )}
    </div>
  );
}
