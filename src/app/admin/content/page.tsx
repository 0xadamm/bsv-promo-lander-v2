import Link from "next/link";
import { getAllContent } from "@/lib/db/content";
import { listSports } from "@/lib/db/sports";
import { listAilments } from "@/lib/db/ailments";

export default async function ContentManager() {
  const [allContent, sports, ailments] = await Promise.all([
    getAllContent(),
    listSports(),
    listAilments(),
  ]);

  // Sort by most recent first
  const sortedContent = allContent.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
                <tr key={content._id.toString()} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {/* Thumbnail */}
                      <div className="h-10 w-10 flex-shrink-0 mr-3">
                        {content.mediaType === "video" ? (
                          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
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
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
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
                      href={`/admin/content/${content._id.toString()}`}
                      className="text-blue-600 hover:text-blue-900"
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
