import { Sport, Ailment } from "@/types/database";

interface FilterBarProps {
  filters: {
    contentType: "all" | "testimonial" | "raw-footage";
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
  const toggleSport = (slug: string) => {
    const newSports = filters.sports.includes(slug)
      ? filters.sports.filter((s) => s !== slug)
      : [...filters.sports, slug];
    onFilterChange({ ...filters, sports: newSports });
  };

  const toggleAilment = (slug: string) => {
    const newAilments = filters.ailments.includes(slug)
      ? filters.ailments.filter((a) => a !== slug)
      : [...filters.ailments, slug];
    onFilterChange({ ...filters, ailments: newAilments });
  };

  const hasActiveFilters =
    filters.contentType !== "all" ||
    filters.sports.length > 0 ||
    filters.ailments.length > 0 ||
    filters.search !== "";

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search and Clear */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search content..."
              value={filters.search}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {resultCount} {resultCount === 1 ? "result" : "results"}
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Content Type Filter */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                onFilterChange({ ...filters, contentType: "all" })
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.contentType === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Content
            </button>
            <button
              onClick={() =>
                onFilterChange({ ...filters, contentType: "testimonial" })
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.contentType === "testimonial"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Testimonials
            </button>
            <button
              onClick={() =>
                onFilterChange({ ...filters, contentType: "raw-footage" })
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.contentType === "raw-footage"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Raw Footage
            </button>
          </div>
        </div>

        {/* Sports Filter */}
        {sports.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Sports
            </div>
            <div className="flex flex-wrap gap-2">
              {sports.map((sport) => {
                const isActive = filters.sports.includes(sport.slug);
                return (
                  <button
                    key={sport.slug}
                    onClick={() => toggleSport(sport.slug)}
                    style={{
                      backgroundColor: isActive ? sport.color || "#3B82F6" : undefined,
                      borderColor: sport.color || "#3B82F6",
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border-2 ${
                      isActive
                        ? "text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {sport.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Ailments Filter */}
        {ailments.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Ailments
            </div>
            <div className="flex flex-wrap gap-2">
              {ailments.map((ailment) => {
                const isActive = filters.ailments.includes(ailment.slug);
                return (
                  <button
                    key={ailment.slug}
                    onClick={() => toggleAilment(ailment.slug)}
                    style={{
                      backgroundColor: isActive ? ailment.color || "#8B5CF6" : undefined,
                      borderColor: ailment.color || "#8B5CF6",
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border-2 ${
                      isActive
                        ? "text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {ailment.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
