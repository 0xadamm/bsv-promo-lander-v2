"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ContentManager from "@/app/admin/content/page";
import { Content, Sport, Ailment } from "@/types/database";

export default function AdminDashboard() {
  const [allContent, setAllContent] = useState<Content[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [ailments, setAilments] = useState<Ailment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contentRes, sportsRes, ailmentsRes] = await Promise.all([
          fetch("/api/content?limit=1000"),
          fetch("/api/sports"),
          fetch("/api/ailments"),
        ]);

        const [contentData, sportsData, ailmentsData] = await Promise.all([
          contentRes.json(),
          sportsRes.json(),
          ailmentsRes.json(),
        ]);

        if (contentData.success) setAllContent(contentData.data);
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

  const testimonials = allContent.filter((c) => c.contentType === "testimonial");
  const rawFootage = allContent.filter((c) => c.contentType === "raw-footage");
  const contentItems = allContent.filter((c) => c.contentType === "content");
  const videos = allContent.filter((c) => c.mediaType === "video");
  const images = allContent.filter((c) => c.mediaType === "image");

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 space-y-8">
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

      {/* Content Manager */}
      <ContentManager />
    </div>
  );
}
