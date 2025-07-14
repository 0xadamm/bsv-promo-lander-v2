"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { beforeAfterPairs } from "@/lib/data";
import Image from "next/image";

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
}: BeforeAfterSliderProps) {
  return (
    <div className="relative">
      {/* Main comparison container */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Before Image */}
          <div className="relative group">
            <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              <Image
                src={beforeImage}
                alt={beforeAlt}
                fill
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
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
              <Image
                src={afterImage}
                alt={afterAlt}
                fill
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
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

        {/* Person caption and story - inside the card */}
        <div className="p-6 text-center border-t border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Khalifa's Story</h3>
          <p className="text-gray-600 leading-relaxed">
            See the incredible before-and-after progress of Khalifa, who experienced daily abdominal discomfort and inflammation. After incorporating Blue Scorpion into his wellness routine, he reported feeling significantly more at ease in his body.
          </p>
        </div>

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
      className="py-16 lg:py-24"
    >
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-10"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-primary mb-4">
            Before & After
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real Stories of Relief
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
