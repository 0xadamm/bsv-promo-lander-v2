"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

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

interface ContentItem {
  _id: string;
  title: string;
  description?: string;
  contentType:
    | "testimonial"
    | "raw-footage"
    | "content"
    | "doctors"
    | "athlete";
  mediaType: "image" | "video";
  mediaUrls: string[];
  sports: string[];
  ailments: string[];
  featured: boolean;
  priority: number;
}

export default function ContentEditor() {
  const params = useParams();
  const router = useRouter();
  const contentId = params?.id as string;

  const [content, setContent] = useState<ContentItem | null>(null);
  const [sports, setSports] = useState<Sport[]>([]);
  const [ailments, setAilments] = useState<Ailment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddSport, setShowAddSport] = useState(false);
  const [showAddAilment, setShowAddAilment] = useState(false);
  const [newSport, setNewSport] = useState({ name: "", color: "#003ebf" });
  const [newAilment, setNewAilment] = useState({
    name: "",
    description: "",
    category: "general" as "joint" | "muscle" | "recovery" | "general",
    color: "#8B5CF6",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [contentRes, sportsRes, ailmentsRes] = await Promise.all([
          fetch(`/api/content/${contentId}`),
          fetch("/api/sports"),
          fetch("/api/ailments"),
        ]);

        const [contentData, sportsData, ailmentsData] = await Promise.all([
          contentRes.json(),
          sportsRes.json(),
          ailmentsRes.json(),
        ]);

        if (contentData.success) {
          setContent(contentData.data);
        }
        if (sportsData.success) {
          setSports(sportsData.data);
        }
        if (ailmentsData.success) {
          setAilments(ailmentsData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [contentId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content) return;

    setSaving(true);

    try {
      const res = await fetch(`/api/content/${contentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: content.title,
          description: content.description,
          contentType: content.contentType,
          mediaType: content.mediaType,
          sports: content.sports,
          ailments: content.ailments,
          featured: content.featured,
          priority: content.priority,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Content updated successfully!");
        router.push("/admin/content");
      } else {
        alert("Error updating content: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating content:", error);
      alert("Error updating content");
    } finally {
      setSaving(false);
    }
  }

  function toggleSport(slug: string) {
    if (!content) return;
    const sports = content.sports.includes(slug)
      ? content.sports.filter((s) => s !== slug)
      : [...content.sports, slug];
    setContent({ ...content, sports });
  }

  function toggleAilment(slug: string) {
    if (!content) return;
    const ailments = content.ailments.includes(slug)
      ? content.ailments.filter((a) => a !== slug)
      : [...content.ailments, slug];
    setContent({ ...content, ailments });
  }

  async function handleDownload() {
    if (!content || !content.mediaUrls[0]) return;

    try {
      const response = await fetch(content.mediaUrls[0]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from URL or use content title
      const urlParts = content.mediaUrls[0].split("/");
      const filename =
        urlParts[urlParts.length - 1] ||
        `${content.title}.${content.mediaType === "video" ? "mp4" : "jpg"}`;

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file");
    }
  }

  async function handleCreateSport(e: React.FormEvent) {
    e.preventDefault();
    if (!content) return;

    try {
      const res = await fetch("/api/sports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSport),
      });

      const data = await res.json();

      if (data.success) {
        setSports([...sports, data.data]);
        setNewSport({ name: "", color: "#003ebf" });
        setShowAddSport(false);
        // Auto-select the newly created sport
        setContent({ ...content, sports: [...content.sports, data.data.slug] });
      } else {
        alert("Error creating sport: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating sport:", error);
      alert("Error creating sport");
    }
  }

  async function handleCreateAilment(e: React.FormEvent) {
    e.preventDefault();
    if (!content) return;

    try {
      const res = await fetch("/api/ailments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAilment),
      });

      const data = await res.json();

      if (data.success) {
        setAilments([...ailments, data.data]);
        setNewAilment({
          name: "",
          description: "",
          category: "general",
          color: "#8B5CF6",
        });
        setShowAddAilment(false);
        // Auto-select the newly created ailment
        setContent({
          ...content,
          ailments: [...content.ailments, data.data.slug],
        });
      } else {
        alert("Error creating ailment: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating ailment:", error);
      alert("Error creating ailment");
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Content not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Content</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update content details, tags, and metadata
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-6">
        {/* Left Column - Media Preview */}
        <div className="w-2/5 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Media Preview
              </h2>
              {content.mediaUrls[0] && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
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
                  Download
                </button>
              )}
            </div>
            {content.mediaType === "video" && content.mediaUrls[0] && (
              <video
                src={content.mediaUrls[0]}
                controls
                className="w-full rounded-lg"
              />
            )}
            {content.mediaType === "image" && content.mediaUrls[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.mediaUrls[0]}
                alt={content.title}
                className="w-full rounded-lg"
              />
            )}
            {!content.mediaUrls[0] && (
              <div className="text-gray-500 text-sm">No media available</div>
            )}
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="flex-1 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={content.title}
                onChange={(e) =>
                  setContent({ ...content, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={content.description || ""}
                onChange={(e) =>
                  setContent({ ...content, description: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a description for this content..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Type *
                </label>
                <select
                  required
                  value={content.contentType}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contentType: e.target.value as
                        | "testimonial"
                        | "raw-footage"
                        | "content"
                        | "doctors"
                        | "athlete",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="testimonial">Testimonial</option>
                  <option value="raw-footage">Raw Footage</option>
                  <option value="content">Content</option>
                  <option value="doctors">Doctors</option>
                  <option value="athlete">Athletes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media Type *
                </label>
                <select
                  required
                  value={content.mediaType}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      mediaType: e.target.value as "image" | "video",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sports Tags */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Sports Tags
              </h2>
              <button
                type="button"
                onClick={() => setShowAddSport(!showAddSport)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showAddSport ? "Cancel" : "+ Add New Sport"}
              </button>
            </div>

            {showAddSport && (
              <form
                onSubmit={handleCreateSport}
                className="mb-4 p-4 bg-gray-50 rounded-md space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Sport Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSport.name}
                    onChange={(e) =>
                      setNewSport({ ...newSport, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., UFC, NBA"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newSport.color}
                      onChange={(e) =>
                        setNewSport({ ...newSport, color: e.target.value })
                      }
                      className="h-12 w-24 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newSport.color}
                      onChange={(e) =>
                        setNewSport({ ...newSport, color: e.target.value })
                      }
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 font-mono"
                    />
                    <span
                      className="px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: newSport.color + "20",
                        color: newSport.color,
                      }}
                    >
                      Preview
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                >
                  Create Sport
                </button>
              </form>
            )}

            {sports.length === 0 && !showAddSport ? (
              <p className="text-sm text-gray-500">
                No sports available. Click &quot;+ Add New Sport&quot; above to
                create one.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {sports.map((sport) => (
                  <button
                    key={sport.slug}
                    type="button"
                    onClick={() => toggleSport(sport.slug)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      content.sports.includes(sport.slug)
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={
                      content.sports.includes(sport.slug) && sport.color
                        ? {
                            backgroundColor: sport.color,
                            color: "white",
                          }
                        : {}
                    }
                  >
                    {sport.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ailments Tags */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Ailments Tags
              </h2>
              <button
                type="button"
                onClick={() => setShowAddAilment(!showAddAilment)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showAddAilment ? "Cancel" : "+ Add New Ailment"}
              </button>
            </div>

            {showAddAilment && (
              <form
                onSubmit={handleCreateAilment}
                className="mb-4 p-4 bg-gray-50 rounded-md space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Ailment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAilment.name}
                    onChange={(e) =>
                      setNewAilment({ ...newAilment, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Joint Pain, Muscle Soreness"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    value={newAilment.description}
                    onChange={(e) =>
                      setNewAilment({
                        ...newAilment,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    rows={2}
                    placeholder="Brief description"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newAilment.color}
                      onChange={(e) =>
                        setNewAilment({ ...newAilment, color: e.target.value })
                      }
                      className="h-12 w-24 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newAilment.color}
                      onChange={(e) =>
                        setNewAilment({ ...newAilment, color: e.target.value })
                      }
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 font-mono"
                    />
                    <span
                      className="px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: newAilment.color + "20",
                        color: newAilment.color,
                      }}
                    >
                      Preview
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
                >
                  Create Ailment
                </button>
              </form>
            )}

            {ailments.length === 0 && !showAddAilment ? (
              <p className="text-sm text-gray-500">
                No ailments available. Click &quot;+ Add New Ailment&quot; above
                to create one.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {ailments.map((ailment) => (
                  <button
                    key={ailment.slug}
                    type="button"
                    onClick={() => toggleAilment(ailment.slug)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      content.ailments.includes(ailment.slug)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={
                      content.ailments.includes(ailment.slug) && ailment.color
                        ? {
                            backgroundColor: ailment.color,
                            color: "white",
                          }
                        : {}
                    }
                  >
                    {ailment.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Metadata</h2>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={content.featured}
                onChange={(e) =>
                  setContent({ ...content, featured: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium text-gray-700"
              >
                Featured content (show prominently on database page)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <input
                type="number"
                value={content.priority}
                onChange={(e) =>
                  setContent({
                    ...content,
                    priority: parseInt(e.target.value) || 0,
                  })
                }
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Higher priority items appear first (default: 0)
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/content")}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
