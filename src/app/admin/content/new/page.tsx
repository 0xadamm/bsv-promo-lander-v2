"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function NewContent() {
  const router = useRouter();

  const [sports, setSports] = useState<Sport[]>([]);
  const [ailments, setAilments] = useState<Ailment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "testimonial" as "testimonial" | "raw-footage" | "content" | "doctors" | "athlete",
    mediaType: "video" as "image" | "video",
    sports: [] as string[],
    ailments: [] as string[],
    featured: false,
    priority: 0,
  });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [sportsRes, ailmentsRes] = await Promise.all([
        fetch("/api/sports"),
        fetch("/api/ailments"),
      ]);

      const [sportsData, ailmentsData] = await Promise.all([
        sportsRes.json(),
        ailmentsRes.json(),
      ]);

      if (sportsData.success) setSports(sportsData.data);
      if (ailmentsData.success) setAilments(ailmentsData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload() {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", selectedFile);
      formDataUpload.append("folder", "content");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();

      if (data.success) {
        setUploadedFiles([...uploadedFiles, data.data.url]);
        setSelectedFile(null);

        // Auto-detect media type from file
        const fileType = selectedFile.type;
        if (fileType.startsWith("video/")) {
          setFormData({ ...formData, mediaType: "video" });
        } else if (fileType.startsWith("image/")) {
          setFormData({ ...formData, mediaType: "image" });
        }

        alert("File uploaded successfully!");
      } else {
        alert("Error uploading file: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (uploadedFiles.length === 0) {
      alert("Please upload at least one file");
      return;
    }

    setCreating(true);

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          mediaUrls: uploadedFiles,
          thumbnailUrl: uploadedFiles[0], // Use first file as thumbnail
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Content created successfully!");
        router.push("/admin/content");
      } else {
        alert("Error creating content: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating content:", error);
      alert("Error creating content");
    } finally {
      setCreating(false);
    }
  }

  function toggleSport(slug: string) {
    const sports = formData.sports.includes(slug)
      ? formData.sports.filter((s) => s !== slug)
      : [...formData.sports, slug];
    setFormData({ ...formData, sports });
  }

  function toggleAilment(slug: string) {
    const ailments = formData.ailments.includes(slug)
      ? formData.ailments.filter((a) => a !== slug)
      : [...formData.ailments, slug];
    setFormData({ ...formData, ailments });
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  }

  function handleFileInputClick() {
    document.getElementById("file-input")?.click();
  }

  async function handleCreateSport(e: React.FormEvent) {
    e.preventDefault();

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
        setFormData({ ...formData, sports: [...formData.sports, data.data.slug] });
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
        setFormData({
          ...formData,
          ailments: [...formData.ailments, data.data.slug],
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Content</h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload media and add content details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upload Media
          </h2>

          <div className="space-y-4">
            {/* Drag and Drop Area */}
            <div
              onClick={handleFileInputClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <input
                id="file-input"
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <svg
                  className={`w-12 h-12 mb-3 ${
                    isDragging ? "text-blue-500" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {isDragging ? "Drop file here" : "Drag and drop file here"}
                </p>
                <p className="text-xs text-gray-500 mb-2">or click to browse</p>
                <p className="text-xs text-gray-400">
                  Images (JPG, PNG, WebP, GIF) up to 10MB
                  <br />
                  Videos (MP4, WebM, MOV) up to 100MB
                </p>
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleFileUpload}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            )}

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Files ({uploadedFiles.length})
                </p>
                <div className="space-y-2">
                  {uploadedFiles.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-md"
                    >
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <p className="flex-1 text-sm text-gray-700 truncate">
                        {url.split("/").pop()}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
                        }
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

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
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Frank Mir UFC Testimonial"
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
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content Type *
              </label>
              <select
                required
                value={formData.contentType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contentType: e.target.value as "testimonial" | "raw-footage" | "content" | "doctors" | "athlete",
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
                value={formData.mediaType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
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
            <h2 className="text-lg font-semibold text-gray-900">Sports Tags</h2>
            <button
              type="button"
              onClick={() => setShowAddSport(!showAddSport)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showAddSport ? "Cancel" : "+ Add New Sport"}
            </button>
          </div>

          {showAddSport && (
            <form onSubmit={handleCreateSport} className="mb-4 p-4 bg-gray-50 rounded-md space-y-3">
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
              No sports available. Click &quot;+ Add New Sport&quot; above to create one.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sports.map((sport) => (
                <button
                  key={sport.slug}
                  type="button"
                  onClick={() => toggleSport(sport.slug)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    formData.sports.includes(sport.slug)
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={
                    formData.sports.includes(sport.slug) && sport.color
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
            <form onSubmit={handleCreateAilment} className="mb-4 p-4 bg-gray-50 rounded-md space-y-3">
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
                    setNewAilment({ ...newAilment, description: e.target.value })
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
              No ailments available. Click &quot;+ Add New Ailment&quot; above to create one.
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
                            formData.ailments.includes(ailment.slug)
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          style={
                            formData.ailments.includes(ailment.slug) &&
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
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
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
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
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
        <div className="flex gap-3 sticky bottom-0 bg-white p-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={creating || uploadedFiles.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? "Creating..." : "Create Content"}
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
