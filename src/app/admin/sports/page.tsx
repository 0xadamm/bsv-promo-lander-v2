"use client";

import { useState, useEffect } from "react";

interface Sport {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  color?: string;
  displayOrder: number;
}

export default function SportsManager() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#003ebf",
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    color: "#003ebf",
  });

  useEffect(() => {
    fetchSports();
  }, []);

  async function fetchSports() {
    try {
      const res = await fetch("/api/sports");
      const data = await res.json();
      if (data.success) {
        setSports(data.data);
      }
    } catch (error) {
      console.error("Error fetching sports:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/sports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        await fetchSports();
        setFormData({ name: "", description: "", color: "#003ebf" });
        setShowForm(false);
      } else {
        alert("Error creating sport: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating sport:", error);
      alert("Error creating sport");
    } finally {
      setSubmitting(false);
    }
  }

  function startEditing(sport: Sport) {
    setEditingSlug(sport.slug);
    setEditFormData({
      name: sport.name,
      description: sport.description || "",
      color: sport.color || "#003ebf",
    });
    setShowForm(false); // Close the add form if open
  }

  function cancelEditing() {
    setEditingSlug(null);
    setEditFormData({ name: "", description: "", color: "#003ebf" });
  }

  async function handleUpdate(e: React.FormEvent, slug: string) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/sports/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();

      if (data.success) {
        await fetchSports();
        cancelEditing();
      } else {
        alert("Error updating sport: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating sport:", error);
      alert("Error updating sport");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Are you sure you want to delete this sport?")) return;

    try {
      const res = await fetch(`/api/sports/${slug}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        await fetchSports();
      } else {
        alert("Error deleting sport: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting sport:", error);
      alert("Error deleting sport");
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sports Manager</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage sports tags for content
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ New Sport"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Sport
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., UFC, NBA, NFL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                rows={2}
                placeholder="Optional description"
              />
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
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                  placeholder="#003ebf"
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
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating..." : "Create Sport"}
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

      {/* Sports Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Sports ({sports.length})
          </h2>
        </div>

        {sports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No sports yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-green-600 hover:text-green-700"
            >
              Create your first sport →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sports.map((sport) => (
              <div key={sport.slug}>
                {editingSlug === sport.slug ? (
                  // Edit Form
                  <div className="px-6 py-4 bg-blue-50">
                    <form onSubmit={(e) => handleUpdate(e, sport.slug)} className="space-y-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-3">
                        Edit Sport
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={editFormData.name}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={editFormData.description}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, description: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tag Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={editFormData.color}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, color: e.target.value })
                            }
                            className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={editFormData.color}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, color: e.target.value })
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                          />
                          <span
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: editFormData.color + "20",
                              color: editFormData.color,
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
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? "Updating..." : "Update Sport"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  // Display Mode
                  <div
                    onClick={() => startEditing(sport)}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
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
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {sport.name}
                        </div>
                        {sport.description && (
                          <div className="text-xs text-gray-500">
                            {sport.description}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          Slug: {sport.slug}
                          {sport.color && ` • Color: ${sport.color}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(sport);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(sport.slug);
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
