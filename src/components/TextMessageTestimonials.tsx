"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import TextMessageCard from "./textmessages/TextMessageCard";

interface TextMessage {
  id: string;
  image: string;
  customerName?: string;
  alt: string;
  filename?: string;
}

export default function TextMessageTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [textMessages, setTextMessages] = useState<TextMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch text message screenshots from API
  useEffect(() => {
    const fetchTextMessages = async () => {
      try {
        setLoading(true);
        console.log("TextMessageTestimonials: Fetching text message screenshots...");

        const response = await fetch("/api/text-messages");
        console.log("TextMessageTestimonials: API response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("TextMessageTestimonials: API data:", data);

          if (data.success && data.data) {
            console.log(
              "TextMessageTestimonials: Got",
              data.data.length,
              "text message screenshots"
            );
            setTextMessages(data.data);
          } else {
            throw new Error("API returned unsuccessful response");
          }
        } else {
          throw new Error(`API request failed with status ${response.status}`);
        }
      } catch (err) {
        console.error("TextMessageTestimonials: Error fetching text messages:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load text message screenshots"
        );

        // Fallback to empty array
        setTextMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTextMessages();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <section
      id="text-messages"
      ref={sectionRef}
      className="py-16 lg:py-16 bg-gradient-to-b from-white to-gray-50"
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
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-primary mb-4">
            Customer Messages
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            Real Messages from Real Customers
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto mb-6">
            See what people are saying about Blue Scorpion…
          </p>
          <div className="flex items-center justify-center space-x-2 text-brand-primary">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-green-500 via-blue-500 to-purple-500 p-[2px]">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <div className="w-3.5 h-3.5 text-brand-primary">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                  </svg>
                </div>
              </div>
            </div>
            <span className="font-semibold">Authentic Conversations</span>
          </div>
        </motion.div>

        {/* Text Messages Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Unable to load text message screenshots at this time.
            </p>
          </div>
        ) : textMessages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No text message screenshots available.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
          >
            {textMessages.map((message) => (
              <motion.div key={message.id} variants={itemVariants}>
                <TextMessageCard message={message} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://bluescorpion.com/products/pain-and-inflammation-relief"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-accent transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="w-6 h-6 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
            </div>
            <span className="ml-2">Try Blue Scorpion Today</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}