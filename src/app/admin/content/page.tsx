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
    type: "sports" | "ailments";
    selectedTags: string[];
    position: { top: number; left: number };
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filters
  const [filters, setFilters] = useState({
    contentType: "all" as "all" | "testimonial" | "raw-footage" | "content",
    mediaType: "all" as "all" | "video" | "image",
    sport: "all",
    ailment: "all",
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

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setEditingTags(null);
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
    if (filters.contentType !== "all" && content.contentType !== filters.contentType) {
      return false;
    }

    // Media Type filter
    if (filters.mediaType !== "all" && content.mediaType !== filters.mediaType) {
      return false;
    }

    // Sport filter
    if (filters.sport !== "all" && !content.sports.includes(filters.sport)) {
      return false;
    }

    // Ailment filter
    if (filters.ailment !== "all" && !content.ailments.includes(filters.ailment)) {
      return false;
    }

    // Search filter (title, description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = content.title.toLowerCase().includes(searchLower);
      const descMatch = content.description?.toLowerCase().includes(searchLower);

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
      contentType: "all",
      mediaType: "all",
      sport: "all",
      ailment: "all",
      search: "",
    });
  }

  function openTagEditor(
    event: React.MouseEvent<HTMLTableCellElement>,
    contentId: string,
    type: "sports" | "ailments",
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
        top: showAbove ? rect.top - Math.min(dropdownHeight, spaceAbove) - 8 : rect.bottom + 8,
        left: rect.left,
      },
    });
  }

  async function toggleTag(slug: string) {
    if (!editingTags) return;

    const newSelectedTags = editingTags.selectedTags.includes(slug)
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
          : { ailments: newSelectedTags };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Title, description..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Content Type
            </label>
            <select
              value={filters.contentType}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  contentType: e.target.value as typeof filters.contentType,
                })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="testimonial">Testimonial</option>
              <option value="raw-footage">Raw Footage</option>
              <option value="content">Content</option>
            </select>
          </div>

          {/* Media Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Media Type
            </label>
            <select
              value={filters.mediaType}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  mediaType: e.target.value as typeof filters.mediaType,
                })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Media</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
            </select>
          </div>

          {/* Sport */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Sport
            </label>
            <select
              value={filters.sport}
              onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Sports</option>
              {sports.map((sport) => (
                <option key={sport.slug} value={sport.slug}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ailment */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Ailment
            </label>
            <select
              value={filters.ailment}
              onChange={(e) => setFilters({ ...filters, ailment: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Ailments</option>
              {ailments.map((ailment) => (
                <option key={ailment.slug} value={ailment.slug}>
                  {ailment.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Count */}
        {(filters.contentType !== "all" ||
          filters.mediaType !== "all" ||
          filters.sport !== "all" ||
          filters.ailment !== "all" ||
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
                            !content.thumbnailUrl.match(/\.(mp4|mov|avi|webm|mkv)$/i);

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
                                      const video = e.target as HTMLVideoElement;
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
                          } else if (content.thumbnailUrl || content.mediaUrls[0]) {
                            return (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={content.thumbnailUrl || content.mediaUrls[0]}
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 w-fit">
                        {content.contentType}
                      </span>
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
                      openTagEditor(e, content._id, "ailments", content.ailments);
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
                    <Link
                      href={`/admin/content/${content._id}`}
                      className="text-blue-600 hover:text-blue-900"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Link>
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
              Edit {editingTags.type === "sports" ? "Sports" : "Ailments"}
            </h3>
          </div>

          <div className="py-2">
            {editingTags.type === "sports" ? (
              sports.map((sport) => (
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
            ) : (
              ailments.map((ailment) => (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
