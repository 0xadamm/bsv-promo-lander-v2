import { Sport, Ailment } from "@/types/database";
import { useState, useRef, useEffect } from "react";

interface FilterBarProps {
  filters: {
    contentType: "all" | "testimonial" | "raw-footage";
    mediaType: "all" | "video" | "image";
    sports: string[];
    ailments: string[];
    search: string;
  };
  sports: Sport[];
  ailments: Ailment[];
  onFilterChange: (filters: FilterBarProps["filters"]) => void;
  onClearFilters: () => void;
  resultCount: number;
}

export default function FilterBar({
  filters,
  sports,
  ailments,
  onFilterChange,
  onClearFilters,
  resultCount,
}: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasActiveFilters =
    filters.contentType !== "all" ||
    filters.mediaType !== "all" ||
    filters.sports.length > 0 ||
    filters.ailments.length > 0 ||
    filters.search !== "";

  const getContentTypeLabel = () => {
    if (filters.contentType === "testimonial") return "Testimonials";
    if (filters.contentType === "raw-footage") return "Raw Footage";
    return "Content Type";
  };

  const getMediaTypeLabel = () => {
    if (filters.mediaType === "video") return "Videos";
    if (filters.mediaType === "image") return "Images";
    return "Media Type";
  };

  const getSportLabel = () => {
    if (filters.sports.length > 0) {
      const sport = sports.find((s) => s.slug === filters.sports[0]);
      return sport?.name || "Sport";
    }
    return "Sport";
  };

  const getAilmentLabel = () => {
    if (filters.ailments.length > 0) {
      const ailment = ailments.find((a) => a.slug === filters.ailments[0]);
      return ailment?.name || "Ailment";
    }
    return "Ailment";
  };

  return (
    <div ref={dropdownRef}>
      {/* Search Bar and Filter Pills */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Bar */}
        <div className="flex-1 min-w-[300px] relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search content..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="w-full pl-11 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all text-sm"
          />
        </div>
        {/* Content Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "content" ? null : "content")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span>{getContentTypeLabel()}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openDropdown === "content" && (
            <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
              {[
                { value: "all", label: "All Content" },
                { value: "testimonial", label: "Testimonials" },
                { value: "raw-footage", label: "Raw Footage" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onFilterChange({ ...filters, contentType: option.value as typeof filters.contentType });
                    setOpenDropdown(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    filters.contentType === option.value ? "border-blue-600" : "border-gray-300"
                  }`}>
                    {filters.contentType === option.value && (
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <span className="text-gray-700">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Media Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "media" ? null : "media")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>{getMediaTypeLabel()}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openDropdown === "media" && (
            <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
              {[
                { value: "all", label: "All Media" },
                { value: "video", label: "Videos" },
                { value: "image", label: "Images" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onFilterChange({ ...filters, mediaType: option.value as typeof filters.mediaType });
                    setOpenDropdown(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    filters.mediaType === option.value ? "border-blue-600" : "border-gray-300"
                  }`}>
                    {filters.mediaType === option.value && (
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <span className="text-gray-700">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sports Dropdown */}
        {sports.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "sports" ? null : "sports")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{getSportLabel()}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openDropdown === "sports" && (
              <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                <button
                  onClick={() => {
                    onFilterChange({ ...filters, sports: [] });
                    setOpenDropdown(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    filters.sports.length === 0 ? "border-blue-600" : "border-gray-300"
                  }`}>
                    {filters.sports.length === 0 && (
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <span className="text-gray-700">All Sports</span>
                </button>
                {sports.map((sport) => (
                  <button
                    key={sport.slug}
                    onClick={() => {
                      onFilterChange({ ...filters, sports: [sport.slug] });
                      setOpenDropdown(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      filters.sports.includes(sport.slug) ? "border-blue-600" : "border-gray-300"
                    }`}>
                      {filters.sports.includes(sport.slug) && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <span className="text-gray-700">{sport.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ailments Dropdown */}
        {ailments.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "ailments" ? null : "ailments")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>{getAilmentLabel()}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openDropdown === "ailments" && (
              <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                <button
                  onClick={() => {
                    onFilterChange({ ...filters, ailments: [] });
                    setOpenDropdown(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    filters.ailments.length === 0 ? "border-blue-600" : "border-gray-300"
                  }`}>
                    {filters.ailments.length === 0 && (
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <span className="text-gray-700">All Ailments</span>
                </button>
                {ailments.map((ailment) => (
                  <button
                    key={ailment.slug}
                    onClick={() => {
                      onFilterChange({ ...filters, ailments: [ailment.slug] });
                      setOpenDropdown(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      filters.ailments.includes(ailment.slug) ? "border-blue-600" : "border-gray-300"
                    }`}>
                      {filters.ailments.includes(ailment.slug) && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <span className="text-gray-700">{ailment.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Result Count */}
        <div className="text-sm text-gray-600 whitespace-nowrap">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
