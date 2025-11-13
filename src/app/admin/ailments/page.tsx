"use client";

import { useState, useEffect } from "react";

interface Ailment {
  _id: string;
  slug: string;
  name: string;
  description: string;
  category: "joint" | "muscle" | "recovery" | "general";
  color?: string;
  displayOrder: number;
}

export default function AilmentsManager() {
  const [ailments, setAilments] = useState<Ailment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "general" as Ailment["category"],
    color: "#8B5CF6",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAilments();
  }, []);

  async function fetchAilments() {
    try {
      const res = await fetch("/api/ailments");
      const data = await res.json();
      if (data.success) {
        setAilments(data.data);
      }
    } catch (error) {
      console.error("Error fetching ailments:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/ailments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        await fetchAilments();
        setFormData({
          name: "",
          description: "",
          category: "general",
          color: "#8B5CF6",
        });
        setShowForm(false);
      } else {
        alert("Error creating ailment: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating ailment:", error);
      alert("Error creating ailment");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Are you sure you want to delete this ailment?")) return;

    try {
      const res = await fetch(`/api/ailments/${slug}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        await fetchAilments();
      } else {
        alert("Error deleting ailment: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting ailment:", error);
      alert("Error deleting ailment");
    }
  }

  // Group by category
  const groupedAilments = {
    joint: ailments.filter((a) => a.category === "joint"),
    muscle: ailments.filter((a) => a.category === "muscle"),
    recovery: ailments.filter((a) => a.category === "recovery"),
    general: ailments.filter((a) => a.category === "general"),
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Ailments Manager
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage ailment tags for content
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ New Ailment"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Ailment
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., Joint Pain, Muscle Soreness"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                rows={2}
                placeholder="Brief description of the ailment"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as Ailment["category"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="general">General</option>
                <option value="joint">Joint</option>
                <option value="muscle">Muscle</option>
                <option value="recovery">Recovery</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                  placeholder="#8B5CF6"
                />
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: formData.color + "20",
                    color: formData.color,
                  }}
                >
                  Preview
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating..." : "Create Ailment"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ailments by Category */}
      <div className="space-y-6">
        {Object.entries(groupedAilments).map(([category, categoryAilments]) => (
          <div key={category} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {category} ({categoryAilments.length})
              </h2>
            </div>

            {categoryAilments.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No {category} ailments yet
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {categoryAilments.map((ailment) => (
                  <div
                    key={ailment.slug}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
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
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {ailment.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ailment.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Slug: {ailment.slug}
                          {ailment.color && ` • Color: ${ailment.color}`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(ailment.slug)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {ailments.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No ailments yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-purple-600 hover:text-purple-700"
          >
            Create your first ailment →
          </button>
        </div>
      )}
    </div>
  );
}
