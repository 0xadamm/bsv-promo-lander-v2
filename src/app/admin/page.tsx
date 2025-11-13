import Link from "next/link";
import { getAllContent } from "@/lib/db/content";
import { listSports } from "@/lib/db/sports";
import { listAilments } from "@/lib/db/ailments";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Fetch stats
  const [allContent, sports, ailments] = await Promise.all([
    getAllContent(),
    listSports(),
    listAilments(),
  ]);

  const testimonials = allContent.filter((c) => c.contentType === "testimonial");
  const rawFootage = allContent.filter((c) => c.contentType === "raw-footage");
  const contentItems = allContent.filter((c) => c.contentType === "content");
  const videos = allContent.filter((c) => c.mediaType === "video");
  const images = allContent.filter((c) => c.mediaType === "image");

  // Get recent uploads (last 10)
  const recentContent = allContent
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of your content database
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Content</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {allContent.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {testimonials.length} testimonials, {rawFootage.length} raw footage, {contentItems.length} content
          </div>
        </div>

        {/* Sports */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sports</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {sports.length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
          <Link
            href="/admin/sports"
            className="mt-4 text-sm text-blue-600 hover:text-blue-700"
          >
            Manage sports →
          </Link>
        </div>

        {/* Ailments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ailments</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {ailments.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
          </div>
          <Link
            href="/admin/ailments"
            className="mt-4 text-sm text-blue-600 hover:text-blue-700"
          >
            Manage ailments →
          </Link>
        </div>

        {/* Media Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Media</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {videos.length + images.length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {videos.length} videos, {images.length} images
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/content/new"
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + New Content
          </Link>
          <Link
            href="/admin/sports"
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            + New Sport
          </Link>
          <Link
            href="/admin/ailments"
            className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            + New Ailment
          </Link>
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Uploads
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentContent.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No content yet
            </div>
          ) : (
            recentContent.map((content) => (
              <Link
                key={content._id.toString()}
                href={`/admin/content/${content._id.toString()}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {content.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {content.contentType}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
                        {content.mediaType}
                      </span>
                      {content.source && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
                          {content.source}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
