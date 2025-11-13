"use client";

import { useState, useEffect } from "react";
import { Content, Sport, Ailment } from "@/types/database";
import ContentGrid from "@/components/database/ContentGrid";
import FilterBar from "@/components/database/FilterBar";
import ContentModal from "@/components/database/ContentModal";
import Navbar from "@/components/Navbar";

export default function DatabasePage() {
  const [content, setContent] = useState<Content[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [ailments, setAilments] = useState<Ailment[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState({
    contentType: "all" as "all" | "testimonial" | "raw-footage" | "content",
    mediaType: "all" as "all" | "video" | "image",
    sports: [] as string[],
    ailments: [] as string[],
    search: "",
  });

  // Modal state
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contentRes, sportsRes, ailmentsRes] = await Promise.all([
          fetch("/api/content?limit=100"),
          fetch("/api/sports"),
          fetch("/api/ailments"),
        ]);

        const [contentData, sportsData, ailmentsData] = await Promise.all([
          contentRes.json(),
          sportsRes.json(),
          ailmentsRes.json(),
        ]);

        if (contentData.success) setContent(contentData.data);
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

  // Filter content based on active filters
  const filteredContent = content.filter((item) => {
    // Content type filter
    if (
      filters.contentType !== "all" &&
      item.contentType !== filters.contentType
    ) {
      return false;
    }

    // Media type filter
    if (filters.mediaType !== "all" && item.mediaType !== filters.mediaType) {
      return false;
    }

    // Sports filter
    if (filters.sports.length > 0) {
      const hasMatchingSport = filters.sports.some((sportSlug) =>
        item.sports.includes(sportSlug)
      );
      if (!hasMatchingSport) return false;
    }

    // Ailments filter
    if (filters.ailments.length > 0) {
      const hasMatchingAilment = filters.ailments.some((ailmentSlug) =>
        item.ailments.includes(ailmentSlug)
      );
      if (!hasMatchingAilment) return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(searchLower);
      const matchesDescription = item.description
        ?.toLowerCase()
        .includes(searchLower);
      if (!matchesTitle && !matchesDescription) return false;
    }

    return true;
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      contentType: "all",
      mediaType: "all",
      sports: [],
      ailments: [],
      search: "",
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#121212" }}>
      <Navbar
        alwaysWithBackground
        backgroundColor="linear-gradient(to right, #cfcfcf 0%, #cfcfcf 100%)"
      />
      {/* Header Section */}
      <div className="pt-36 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold mb-3 text-white">
              Content Database
            </h1>
            <p className="text-lg text-gray-400">
              Real results from real people
            </p>
          </div>

          {/* Filter Bar */}
          <FilterBar
            filters={filters}
            sports={sports}
            ailments={ailments}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            resultCount={filteredContent.length}
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No content found</p>
            {(filters.contentType !== "all" ||
              filters.mediaType !== "all" ||
              filters.sports.length > 0 ||
              filters.ailments.length > 0 ||
              filters.search) && (
              <button
                onClick={handleClearFilters}
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <ContentGrid
            content={filteredContent}
            sports={sports}
            ailments={ailments}
            onContentClick={setSelectedContent}
          />
        )}
      </div>
      {/* Content Modal */}
      {selectedContent && (
        <ContentModal
          content={selectedContent}
          sports={sports}
          ailments={ailments}
          onClose={() => setSelectedContent(null)}
          onNext={() => {
            const currentIndex = filteredContent.findIndex(
              (c) => c._id === selectedContent._id
            );
            if (currentIndex < filteredContent.length - 1) {
              setSelectedContent(filteredContent[currentIndex + 1]);
            }
          }}
          onPrevious={() => {
            const currentIndex = filteredContent.findIndex(
              (c) => c._id === selectedContent._id
            );
            if (currentIndex > 0) {
              setSelectedContent(filteredContent[currentIndex - 1]);
            }
          }}
          hasNext={
            filteredContent.findIndex((c) => c._id === selectedContent._id) <
            filteredContent.length - 1
          }
          hasPrevious={
            filteredContent.findIndex((c) => c._id === selectedContent._id) > 0
          }
        />
      )}
    </div>
  );
}
