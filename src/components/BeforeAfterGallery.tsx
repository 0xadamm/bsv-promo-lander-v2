"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { beforeAfterPairs } from "@/lib/data";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  caption: string;
}

function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  caption,
}: BeforeAfterSliderProps) {
  return (
    <div className="relative">
      {/* Main comparison container */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Before Image */}
          <div className="relative group">
            <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              <img
                src={beforeImage}
                alt={beforeAlt}
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
            <div className="absolute top-6 left-6">
              <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                Before
              </div>
            </div>
          </div>

          {/* After Image */}
          <div className="relative group">
            <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              <img
                src={afterImage}
                alt={afterAlt}
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
            <div className="absolute top-6 right-6">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                After
              </div>
            </div>
          </div>
        </div>

      </div>

      
      {/* Simple text caption */}
      <div className="mt-6 text-center">
        <p className="text-gray-700 font-medium text-lg">Khalifa</p>
      </div>

      {/* Navigation arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-8">
        <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center opacity-50 cursor-not-allowed">
          <ChevronLeft size={24} className="text-gray-400" />
        </div>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-8">
        <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center opacity-50 cursor-not-allowed">
          <ChevronRight size={24} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfterGallery() {
  // Only show the first slide
  const currentSlide = 0;

  return (
    <section
      id="before-after"
      className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white"
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
            Incredible Pain Relief Results
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See the remarkable before and after mobility improvements from real
            customers. Compare the amazing pain relief power of Blue Scorpion.
          </p>
        </motion.div>

        {/* Single Slide Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="px-4 lg:px-8">
            <BeforeAfterSlider
              beforeImage={beforeAfterPairs[currentSlide].before}
              afterImage={beforeAfterPairs[currentSlide].after}
              beforeAlt={beforeAfterPairs[currentSlide].beforeAlt}
              afterAlt={beforeAfterPairs[currentSlide].afterAlt}
              caption={beforeAfterPairs[currentSlide].caption}
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
