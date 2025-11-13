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
  contentType: "testimonial" | "raw-footage";
  mediaType: "image" | "video" | "text";
  mediaUrls: string[];
  sports: string[];
  ailments: string[];
  athleteName?: string;
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

  useEffect(() => {
    fetchData();
  }, [contentId]);

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
          sports: content.sports,
          ailments: content.ailments,
          athleteName: content.athleteName,
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Content</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update content details, tags, and metadata
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Athlete Name
            </label>
            <input
              type="text"
              value={content.athleteName || ""}
              onChange={(e) =>
                setContent({ ...content, athleteName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Optional: specific athlete name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content Type
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                {content.contentType}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media Type
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                {content.mediaType}
              </div>
            </div>
          </div>
        </div>

        {/* Sports Tags */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sports Tags
          </h2>
          {sports.length === 0 ? (
            <p className="text-sm text-gray-500">
              No sports available.{" "}
              <a href="/admin/sports" className="text-blue-600 hover:text-blue-700">
                Add sports →
              </a>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Ailments Tags
          </h2>
          {ailments.length === 0 ? (
            <p className="text-sm text-gray-500">
              No ailments available.{" "}
              <a href="/admin/ailments" className="text-blue-600 hover:text-blue-700">
                Add ailments →
              </a>
            </p>
          ) : (
            <div className="space-y-3">
              {["joint", "muscle", "recovery", "general"].map((category) => {
                const categoryAilments = ailments.filter(
                  (a) => a.category === category
                );
                if (categoryAilments.length === 0) return null;

                return (
                  <div key={category}>
                    <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categoryAilments.map((ailment) => (
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
                            content.ailments.includes(ailment.slug) &&
                            ailment.color
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
                  </div>
                );
              })}
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
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
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
                setContent({ ...content, priority: parseInt(e.target.value) || 0 })
              }
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Higher priority items appear first (default: 0)
            </p>
          </div>
        </div>

        {/* Media Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Media</h2>
          {content.mediaType === "video" && content.mediaUrls[0] && (
            <video
              src={content.mediaUrls[0]}
              controls
              className="w-full max-w-2xl rounded-lg"
            />
          )}
          {content.mediaType === "image" && content.mediaUrls[0] && (
            <img
              src={content.mediaUrls[0]}
              alt={content.title}
              className="w-full max-w-2xl rounded-lg"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 sticky bottom-0 bg-white p-4 border-t border-gray-200">
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
      </form>
    </div>
  );
}
