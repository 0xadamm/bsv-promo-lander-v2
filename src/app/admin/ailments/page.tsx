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
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    category: "general" as Ailment["category"],
    color: "#8B5CF6",
  });

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

  function startEditing(ailment: Ailment) {
    setEditingSlug(ailment.slug);
    setEditFormData({
      name: ailment.name,
      description: ailment.description,
      category: ailment.category,
      color: ailment.color || "#8B5CF6",
    });
    setShowForm(false); // Close the add form if open
  }

  function cancelEditing() {
    setEditingSlug(null);
    setEditFormData({
      name: "",
      description: "",
      category: "general",
      color: "#8B5CF6",
    });
  }

  async function handleUpdate(e: React.FormEvent, slug: string) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/ailments/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();

      if (data.success) {
        await fetchAilments();
        cancelEditing();
      } else {
        alert("Error updating ailment: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating ailment:", error);
      alert("Error updating ailment");
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

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 space-y-6">
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

      {/* Ailments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Ailments ({ailments.length})
          </h2>
        </div>

        {ailments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No ailments yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-purple-600 hover:text-purple-700"
            >
              Create your first ailment →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {ailments.map((ailment) => (
              <div key={ailment.slug}>
                {editingSlug === ailment.slug ? (
                  // Edit Form
                  <div className="px-6 py-4 bg-blue-50">
                    <form onSubmit={(e) => handleUpdate(e, ailment.slug)} className="space-y-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-3">
                        Edit Ailment
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description *
                        </label>
                        <textarea
                          required
                          value={editFormData.description}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, description: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
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
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
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
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? "Updating..." : "Update Ailment"}
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
                    onClick={() => startEditing(ailment)}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
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
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(ailment);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ailment.slug);
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
