"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
  athleteName?: string;
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

    // Search filter (title, description, athlete name)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = content.title.toLowerCase().includes(searchLower);
      const descMatch = content.description?.toLowerCase().includes(searchLower);
      const athleteMatch = content.athleteName?.toLowerCase().includes(searchLower);

      if (!titleMatch && !descMatch && !athleteMatch) {
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
                        {content.thumbnailUrl ? (
                          content.mediaType === "video" ? (
                            <div className="relative h-12 w-12 bg-gray-200 rounded overflow-hidden">
                              <img
                                src={content.thumbnailUrl}
                                alt={content.title}
                                className="h-full w-full object-cover"
                              />
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
                          ) : (
                            <img
                              src={content.thumbnailUrl}
                              alt={content.title}
                              className="h-12 w-12 rounded object-cover"
                            />
                          )
                        ) : (
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
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {content.title}
                        </div>
                        {content.athleteName && (
                          <div className="text-xs text-gray-500">
                            {content.athleteName}
                          </div>
                        )}
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
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
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
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
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
    </div>
  );
}
