"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { TestimonialCard } from "./TestimonialCard";
import { useTestimonials } from "@/hooks/useTestimonials";

export default function WallOfLove() {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    testimonials,
    loading,
    loadingMore,
    error,
    hasMorePages,
    loadMoreReviews,
  } = useTestimonials();

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-20 lg:py-16 bg-gray-50"
    >
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            Wall of Love
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our customers are saying about us
          </p>
          <a
            href="https://bluescorpion.com/products/pain-and-inflammation-relief"
            className="inline-flex items-center mt-6 text-brand-primary hover:text-brand-accent transition-colors duration-200"
          >
            Visit our website →
          </a>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Failed to load testimonials
            </p>
            <p className="text-gray-600 text-sm">
              Please try refreshing the page
            </p>
          </div>
        )}

        {/* Testimonials Grid */}
        {!loading && testimonials.length > 0 && (
          <>
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} {...testimonial} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMorePages && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMoreReviews}
                  disabled={loadingMore}
                  className="inline-flex items-center px-8 py-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-accent transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  type="button"
                  aria-label="Load more testimonials"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading More...
                    </>
                  ) : (
                    "Load More Reviews"
                  )}
                </button>
              </div>
            )}

            {/* All Reviews Loaded Message */}
            {!hasMorePages && (
              <div className="text-center mt-12">
                <p className="text-gray-500 font-medium">
                  🎉 You&apos;ve seen all our amazing reviews!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}