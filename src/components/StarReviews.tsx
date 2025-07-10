"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { reviews, aggregateRating, testimonials } from "@/lib/data";

export default function StarReviews() {
  const [currentReview, setCurrentReview] = useState(0);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Auto-cycle reviews every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Intersection observer for testimonial cards
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const cardId = entry.target.getAttribute("data-card-id");
            if (cardId) {
              setVisibleCards((prev) => new Set(prev).add(cardId));
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-50px",
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Observe cards when they mount
  useEffect(() => {
    if (observerRef.current) {
      const cards = document.querySelectorAll("[data-card-id]");
      cards.forEach((card) => observerRef.current?.observe(card));
    }
  }, []);

  const renderStars = (rating: number, size: number = 20) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={size}
        className={`${
          index < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 fill-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Create masonry layout with different card heights
  const getMasonryClassName = (index: number) => {
    const patterns = [
      "md:row-span-2", // Taller card
      "md:row-span-1", // Normal card
      "md:row-span-1", // Normal card
      "md:row-span-3", // Tallest card
      "md:row-span-1", // Normal card
      "md:row-span-2", // Taller card
    ];
    return patterns[index % patterns.length];
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section
      id="reviews"
      className="py-16 lg:py-24 bg-brand-primary text-white"
    >
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            ⭐ 5-Star Reviews ⭐
          </h2>
          <p className="text-xl text-brand-light max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found lasting pain
            relief with Blue Scorpion
          </p>
        </motion.div>

        {/* Aggregate Rating */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12 max-w-2xl mx-auto">
            {/* Star Rating */}
            <div className="flex justify-center mb-4">
              {renderStars(Math.floor(aggregateRating.average), 32)}
            </div>

            {/* Rating Number */}
            <div className="text-5xl lg:text-6xl font-bold mb-2">
              {aggregateRating.average}
            </div>

            {/* Rating Label */}
            <div className="text-xl text-brand-light mb-6">out of 5 stars</div>

            {/* Total Reviews */}
            <div className="text-lg">
              Based on{" "}
              <span className="font-bold">
                {aggregateRating.total.toLocaleString()}
              </span>{" "}
              verified reviews
            </div>

            {/* Rating Breakdown */}
            <div className="mt-8 space-y-2">
              {Object.entries(aggregateRating.breakdown)
                .reverse()
                .map(([stars, count]) => (
                  <div
                    key={stars}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{stars}</span>
                      <Star
                        size={16}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-yellow-400 h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${(count / aggregateRating.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right min-w-[3rem]">{count}</div>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>

        {/* Cycling Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="relative h-64 lg:h-48 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReview}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center">
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <Quote
                      size={48}
                      className="text-brand-gold mx-auto opacity-60"
                    />
                  </div>

                  {/* Review Text */}
                  <blockquote className="text-xl lg:text-2xl font-medium mb-6 leading-relaxed">
                    &ldquo;{reviews[currentReview].text}&rdquo;
                  </blockquote>

                  {/* Reviewer Info */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(reviews[currentReview].rating, 16)}
                    </div>
                    <div className="text-lg font-semibold">
                      {reviews[currentReview].name}
                    </div>
                    <div className="text-sm text-brand-light">
                      {formatDate(reviews[currentReview].date)}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Review Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentReview
                    ? "bg-brand-gold scale-125"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Testimonial Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              What Our Customers Are Saying
            </h3>
            <p className="text-brand-light max-w-2xl mx-auto">
              Real stories from real customers who have experienced the
              life-changing pain relief power of Blue Scorpion
            </p>
          </div>

          {/* Testimonials Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-min"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={cardVariants}
                data-card-id={testimonial.id}
                className={`group relative ${getMasonryClassName(index)}`}
              >
                <div
                  className={`
                  relative h-full bg-white/10 backdrop-blur-sm border border-white/20
                  rounded-xl p-6 lg:p-8 
                  hover:bg-white/15 hover:border-white/30
                  transition-all duration-300 transform hover:-translate-y-2
                  ${visibleCards.has(testimonial.id) ? "animate-scale-in" : ""}
                `}
                >
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
                    <Quote size={32} className="text-brand-gold" />
                  </div>

                  {/* User Avatar */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-gold to-yellow-400 flex items-center justify-center text-brand-dark font-bold text-lg shadow-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-white text-lg">
                        {testimonial.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        {testimonial.rating && renderStars(testimonial.rating)}
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote className="text-brand-light leading-relaxed mb-6 relative">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  {/* Verification Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                        <svg
                          className="w-2 h-2 text-white"
                          fill="currentColor"
                          viewBox="0 0 8 8"
                        >
                          <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                        </svg>
                      </div>
                      <span className="text-sm text-green-400 font-medium">
                        Verified Customer
                      </span>
                    </div>

                    {/* Hover effect indicator */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-gold/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2">
                {aggregateRating.average}★
              </div>
              <div className="text-brand-light">Average Rating</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2">
                {Math.round(
                  (aggregateRating.breakdown[5] / aggregateRating.total) * 100
                )}
                %
              </div>
              <div className="text-brand-light">5-Star Reviews</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2">
                {aggregateRating.total.toLocaleString()}+
              </div>
              <div className="text-brand-light">Happy Customers</div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="bg-brand-gold text-brand-dark px-8 py-4 rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 text-lg font-semibold shadow-lg">
            Join Our Happy Customers - Shop Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}
