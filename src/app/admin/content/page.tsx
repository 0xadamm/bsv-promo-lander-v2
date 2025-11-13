"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface ContentItem {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  contentType: string;
  mediaType: "image" | "video";
  mediaUrls: string[];
  thumbnailUrl?: string;
  sports: string[];
  ailments: string[];
  source?: string;
  published: boolean;
  featured: boolean;
  priority: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Sport {
  slug: string;
  name: string;
  color?: string;
}

interface Ailment {
  slug: string;
  name: string;
  category: string;
  color?: string;
}

export default function ContentManager() {
  const router = useRouter();
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [ailments, setAilments] = useState<Ailment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTags, setEditingTags] = useState<{
    contentId: string;
    type: "sports" | "ailments" | "contentType";
    selectedTags: string[];
    position: { top: number; left: number };
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openFilterDropdown, setOpenFilterDropdown] = useState<string | null>(
    null
  );
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Filters
  const [filters, setFilters] = useState({
    contentType: [] as string[],
    mediaType: [] as string[],
    sports: [] as string[],
    ailments: [] as string[],
    search: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [contentRes, sportsRes, ailmentsRes] = await Promise.all([
          fetch("/api/content?limit=1000"),
          fetch("/api/sports"),
          fetch("/api/ailments"),
        ]);

        const [contentData, sportsData, ailmentsData] = await Promise.all([
          contentRes.json(),
          sportsRes.json(),
          ailmentsRes.json(),
        ]);

        if (contentData.success) setAllContent(contentData.data);
        if (sportsData.success) setSports(sportsData.data);
        if (ailmentsData.success) setAilments(ailmentsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Handle click outside dropdown for tag editor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setEditingTags(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle click outside dropdown for filters
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenFilterDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  // Apply filters
  const filteredContent = allContent.filter((content) => {
    // Content Type filter
    if (
      filters.contentType.length > 0 &&
      !filters.contentType.includes(content.contentType)
    ) {
      return false;
    }

    // Media Type filter
    if (
      filters.mediaType.length > 0 &&
      !filters.mediaType.includes(content.mediaType)
    ) {
      return false;
    }

    // Sport filter
    if (
      filters.sports.length > 0 &&
      !content.sports.some((s) => filters.sports.includes(s))
    ) {
      return false;
    }

    // Ailment filter
    if (
      filters.ailments.length > 0 &&
      !content.ailments.some((a) => filters.ailments.includes(a))
    ) {
      return false;
    }

    // Search filter (title, description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = content.title.toLowerCase().includes(searchLower);
      const descMatch = content.description
        ?.toLowerCase()
        .includes(searchLower);

      if (!titleMatch && !descMatch) {
        return false;
      }
    }

    return true;
  });

  // Sort by most recent first
  const sortedContent = [...filteredContent].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  function resetFilters() {
    setFilters({
      contentType: [],
      mediaType: [],
      sports: [],
      ailments: [],
      search: "",
    });
  }

  function openTagEditor(
    event: React.MouseEvent<HTMLTableCellElement>,
    contentId: string,
    type: "sports" | "ailments" | "contentType",
    currentTags: string[]
  ) {
    const rect = event.currentTarget.getBoundingClientRect();
    const dropdownHeight = 400; // max-height of dropdown
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // If not enough space below but more space above, show dropdown above the element
    const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    setEditingTags({
      contentId,
      type,
      selectedTags: [...currentTags],
      position: {
        top: showAbove
          ? rect.top - Math.min(dropdownHeight, spaceAbove) - 8
          : rect.bottom + 8,
        left: rect.left,
      },
    });
  }

  async function toggleTag(slug: string) {
    if (!editingTags) return;

    // For contentType, only allow single selection (radio behavior)
    const newSelectedTags =
      editingTags.type === "contentType"
        ? [slug]
        : editingTags.selectedTags.includes(slug)
        ? editingTags.selectedTags.filter((s) => s !== slug)
        : [...editingTags.selectedTags, slug];

    // Update local state immediately for responsive UI
    setEditingTags({
      ...editingTags,
      selectedTags: newSelectedTags,
    });

    // Auto-save in background
    try {
      const updateData =
        editingTags.type === "sports"
          ? { sports: newSelectedTags }
          : editingTags.type === "ailments"
          ? { ailments: newSelectedTags }
          : { contentType: newSelectedTags[0] }; // contentType is a single string

      const response = await fetch(`/api/content/${editingTags.contentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // Update the content list
        setAllContent((prev) =>
          prev.map((content) =>
            content._id === editingTags.contentId
              ? { ...content, ...updateData }
              : content
          )
        );

        // Auto-close dropdown for contentType after selection
        if (editingTags.type === "contentType") {
          setEditingTags(null);
        }
      } else {
        // Revert on failure
        alert("Failed to update tags");
        setEditingTags({
          ...editingTags,
          selectedTags: editingTags.selectedTags,
        });
      }
    } catch (error) {
      console.error("Error saving tags:", error);
      alert("Error saving tags");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Manager</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage all testimonials and raw footage
          </p>
        </div>
        <Link
          href="/admin/content/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + New Content
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
          <button
            onClick={resetFilters}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Reset All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3" ref={filterDropdownRef}>
          {/* Search */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              placeholder="Title, description..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Content Type */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Content Type{" "}
              {filters.contentType.length > 0 &&
                `(${filters.contentType.length})`}
            </label>
            <button
              type="button"
              onClick={() =>
                setOpenFilterDropdown(
                  openFilterDropdown === "contentType" ? null : "contentType"
                )
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-left flex items-center justify-between bg-white hover:bg-gray-50"
            >
              <span className="text-gray-700">
                {filters.contentType.length === 0
                  ? "All Types"
                  : `${filters.contentType.length} selected`}
              </span>
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openFilterDropdown === "contentType" && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 max-h-60 overflow-auto">
                {[
                  { value: "testimonial", label: "Testimonial" },
                  { value: "raw-footage", label: "Raw Footage" },
                  { value: "content", label: "Content" },
                  { value: "doctors", label: "Doctors" },
                  { value: "athlete", label: "Athlete" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={filters.contentType.includes(option.value)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.contentType, option.value]
                          : filters.contentType.filter(
                              (t) => t !== option.value
                            );
                        setFilters({ ...filters, contentType: newTypes });
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Media Type */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Media Type{" "}
              {filters.mediaType.length > 0 && `(${filters.mediaType.length})`}
            </label>
            <button
              type="button"
              onClick={() =>
                setOpenFilterDropdown(
                  openFilterDropdown === "mediaType" ? null : "mediaType"
                )
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-left flex items-center justify-between bg-white hover:bg-gray-50"
            >
              <span className="text-gray-700">
                {filters.mediaType.length === 0
                  ? "All Media"
                  : `${filters.mediaType.length} selected`}
              </span>
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openFilterDropdown === "mediaType" && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 max-h-60 overflow-auto">
                {[
                  { value: "video", label: "Video" },
                  { value: "image", label: "Image" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={filters.mediaType.includes(option.value)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.mediaType, option.value]
                          : filters.mediaType.filter((t) => t !== option.value);
                        setFilters({ ...filters, mediaType: newTypes });
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Sport */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Sport{" "}
              {filters.sports.length > 0 && `(${filters.sports.length})`}
            </label>
            <button
              type="button"
              onClick={() =>
                setOpenFilterDropdown(
                  openFilterDropdown === "sport" ? null : "sport"
                )
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-left flex items-center justify-between bg-white hover:bg-gray-50"
            >
              <span className="text-gray-700">
                {filters.sports.length === 0
                  ? "All Sports"
                  : `${filters.sports.length} selected`}
              </span>
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openFilterDropdown === "sport" && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 max-h-60 overflow-auto">
                {sports.map((sport) => (
                  <label
                    key={sport.slug}
                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={filters.sports.includes(sport.slug)}
                      onChange={(e) => {
                        const newSports = e.target.checked
                          ? [...filters.sports, sport.slug]
                          : filters.sports.filter((s) => s !== sport.slug);
                        setFilters({ ...filters, sports: newSports });
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-gray-700">{sport.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Ailment */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Ailment{" "}
              {filters.ailments.length > 0 && `(${filters.ailments.length})`}
            </label>
            <button
              type="button"
              onClick={() =>
                setOpenFilterDropdown(
                  openFilterDropdown === "ailment" ? null : "ailment"
                )
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-left flex items-center justify-between bg-white hover:bg-gray-50"
            >
              <span className="text-gray-700">
                {filters.ailments.length === 0
                  ? "All Ailments"
                  : `${filters.ailments.length} selected`}
              </span>
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openFilterDropdown === "ailment" && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 max-h-60 overflow-auto">
                {ailments.map((ailment) => (
                  <label
                    key={ailment.slug}
                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={filters.ailments.includes(ailment.slug)}
                      onChange={(e) => {
                        const newAilments = e.target.checked
                          ? [...filters.ailments, ailment.slug]
                          : filters.ailments.filter((a) => a !== ailment.slug);
                        setFilters({ ...filters, ailments: newAilments });
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-gray-700">{ailment.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Count */}
        {(filters.contentType.length > 0 ||
          filters.mediaType.length > 0 ||
          filters.sports.length > 0 ||
          filters.ailments.length > 0 ||
          filters.search) && (
          <div className="mt-3 text-xs text-gray-600">
            Showing {sortedContent.length} of {allContent.length} items
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="font-medium text-gray-900">Total:</span>{" "}
            <span className="text-gray-600">{allContent.length}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Testimonials:</span>{" "}
            <span className="text-gray-600">
              {allContent.filter((c) => c.contentType === "testimonial").length}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Raw Footage:</span>{" "}
            <span className="text-gray-600">
              {allContent.filter((c) => c.contentType === "raw-footage").length}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Content:</span>{" "}
            <span className="text-gray-600">
              {allContent.filter((c) => c.contentType === "content").length}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Doctors:</span>{" "}
            <span className="text-gray-600">
              {allContent.filter((c) => c.contentType === "doctors").length}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Athletes:</span>{" "}
            <span className="text-gray-600">
              {allContent.filter((c) => c.contentType === "athlete").length}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Videos:</span>{" "}
            <span className="text-gray-600">
              {allContent.filter((c) => c.mediaType === "video").length}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Images:</span>{" "}
            <span className="text-gray-600">
              {allContent.filter((c) => c.mediaType === "image").length}
            </span>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sports
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ailments
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedContent.map((content) => {
              const contentSports = sports.filter((s) =>
                content.sports.includes(s.slug)
              );
              const contentAilments = ailments.filter((a) =>
                content.ailments.includes(a.slug)
              );

              return (
                <tr
                  key={content._id}
                  onClick={() => router.push(`/admin/content/${content._id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {/* Thumbnail */}
                      <div className="h-12 w-12 flex-shrink-0 mr-3">
                        {(() => {
                          // Check if thumbnailUrl is actually an image (not a video file)
                          const isValidThumbnail =
                            content.thumbnailUrl &&
                            !content.thumbnailUrl.match(
                              /\.(mp4|mov|avi|webm|mkv)$/i
                            );

                          if (content.mediaType === "video") {
                            const videoUrl = content.mediaUrls[0];
                            return (
                              <div className="relative h-12 w-12 bg-gray-200 rounded overflow-hidden">
                                {isValidThumbnail ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={content.thumbnailUrl}
                                    alt={content.title}
                                    className="h-full w-full object-cover"
                                  />
                                ) : videoUrl ? (
                                  <video
                                    src={videoUrl}
                                    className="h-full w-full object-cover"
                                    muted
                                    preload="metadata"
                                    playsInline
                                    onLoadedMetadata={(e) => {
                                      const video =
                                        e.target as HTMLVideoElement;
                                      video.currentTime = 0.1;
                                    }}
                                  />
                                ) : (
                                  <div className="h-full w-full bg-gray-300" />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                  <svg
                                    className="w-6 h-6 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            );
                          } else if (
                            content.thumbnailUrl ||
                            content.mediaUrls[0]
                          ) {
                            return (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={
                                  content.thumbnailUrl || content.mediaUrls[0]
                                }
                                alt={content.title}
                                className="h-12 w-12 rounded object-cover"
                              />
                            );
                          } else {
                            return (
                              <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-gray-500"
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
                            );
                          }
                        })()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {content.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      openTagEditor(e, content._id, "contentType", [
                        content.contentType,
                      ]);
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <span className="inline-flex text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 w-fit">
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
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </div>
                      <span className="inline-flex text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 w-fit">
                        {content.mediaType}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      openTagEditor(e, content._id, "sports", content.sports);
                    }}
                  >
                    <div className="flex flex-wrap gap-1 items-center">
                      {contentSports.length > 0 ? (
                        contentSports.map((sport) => (
                          <span
                            key={sport.slug}
                            className="inline-flex text-xs px-2 py-1 rounded-full bg-green-100 text-green-800"
                            style={
                              sport.color
                                ? {
                                    backgroundColor: sport.color + "20",
                                    color: sport.color,
                                  }
                                : {}
                            }
                          >
                            {sport.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No tags</span>
                      )}
                      <svg
                        className="w-4 h-4 text-gray-400 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      openTagEditor(
                        e,
                        content._id,
                        "ailments",
                        content.ailments
                      );
                    }}
                  >
                    <div className="flex flex-wrap gap-1 items-center">
                      {contentAilments.length > 0 ? (
                        contentAilments.map((ailment) => (
                          <span
                            key={ailment.slug}
                            className="inline-flex text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800"
                            style={
                              ailment.color
                                ? {
                                    backgroundColor: ailment.color + "20",
                                    color: ailment.color,
                                  }
                                : {}
                            }
                          >
                            {ailment.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No tags</span>
                      )}
                      <svg
                        className="w-4 h-4 text-gray-400 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/content/${content._id}`}
                        className="text-blue-600 hover:text-blue-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            const response = await fetch(`/api/content/${content._id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ published: !content.published }),
                            });

                            if (response.ok) {
                              setAllContent((prev) =>
                                prev.map((c) =>
                                  c._id === content._id
                                    ? { ...c, published: !c.published }
                                    : c
                                )
                              );
                            } else {
                              alert("Failed to update publish status");
                            }
                          } catch (error) {
                            console.error("Error updating publish status:", error);
                            alert("Error updating publish status");
                          }
                        }}
                        className={`${
                          content.published
                            ? "text-orange-600 hover:text-orange-900"
                            : "text-green-600 hover:text-green-900"
                        }`}
                      >
                        {content.published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!confirm("Are you sure you want to permanently delete this content? This cannot be undone.")) {
                            return;
                          }

                          try {
                            const response = await fetch(`/api/content/${content._id}`, {
                              method: "DELETE",
                            });

                            if (response.ok) {
                              setAllContent((prev) =>
                                prev.filter((c) => c._id !== content._id)
                              );
                            } else {
                              alert("Failed to delete content");
                            }
                          } catch (error) {
                            console.error("Error deleting content:", error);
                            alert("Error deleting content");
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No content yet</p>
            <Link
              href="/admin/content/new"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              Create your first content item →
            </Link>
          </div>
        )}
      </div>

      {/* Tag Editor Dropdown */}
      {editingTags && (
        <div
          ref={dropdownRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 max-h-[400px] overflow-auto"
          style={{
            top: `${editingTags.position.top}px`,
            left: `${editingTags.position.left}px`,
            minWidth: "300px",
            maxWidth: "400px",
          }}
        >
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">
              Edit{" "}
              {editingTags.type === "sports"
                ? "Sports"
                : editingTags.type === "ailments"
                ? "Ailments"
                : "Content Type"}
            </h3>
          </div>

          <div className="py-2">
            {editingTags.type === "sports"
              ? sports.map((sport) => (
                  <label
                    key={sport.slug}
                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={editingTags.selectedTags.includes(sport.slug)}
                      onChange={() => toggleTag(sport.slug)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span
                      className="ml-3 text-sm font-medium"
                      style={{ color: sport.color || "#000" }}
                    >
                      {sport.name}
                    </span>
                    {sport.color && (
                      <div
                        className="ml-auto w-4 h-4 rounded-full"
                        style={{ backgroundColor: sport.color }}
                      />
                    )}
                  </label>
                ))
              : editingTags.type === "ailments"
              ? ailments.map((ailment) => (
                  <label
                    key={ailment.slug}
                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={editingTags.selectedTags.includes(ailment.slug)}
                      onChange={() => toggleTag(ailment.slug)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span
                      className="ml-3 text-sm font-medium"
                      style={{ color: ailment.color || "#000" }}
                    >
                      {ailment.name}
                    </span>
                    {ailment.color && (
                      <div
                        className="ml-auto w-4 h-4 rounded-full"
                        style={{ backgroundColor: ailment.color }}
                      />
                    )}
                  </label>
                ))
              : [
                  { value: "testimonial", label: "Testimonial" },
                  { value: "raw-footage", label: "Raw Footage" },
                  { value: "content", label: "Content" },
                  { value: "doctors", label: "Doctors" },
                  { value: "athlete", label: "Athlete" },
                ].map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="contentType"
                      checked={editingTags.selectedTags.includes(type.value)}
                      onChange={() => toggleTag(type.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {type.label}
                    </span>
                  </label>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
