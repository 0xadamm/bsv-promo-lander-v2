"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Move } from "lucide-react";
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
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    setSliderPosition(clampedPercentage);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    setSliderPosition(clampedPercentage);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        setSliderPosition(clampedPercentage);
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="relative group">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-200 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={isDragging ? handleTouchMove : undefined}
        onTouchEnd={handleTouchEnd}
      >
        {/* After Image (background) */}
        <div className="absolute inset-0">
          <img
            src={afterImage}
            alt={afterAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            After
          </div>
        </div>

        {/* Before Image (foreground with clip) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        >
          <img
            src={beforeImage}
            alt={beforeAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Before
          </div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize group-hover:w-1.5 transition-all duration-200"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        >
          {/* Handle Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:w-10 group-hover:h-10 transition-all duration-200">
            <Move size={16} className="text-gray-600" />
          </div>
        </div>

        {/* Instruction overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
            Drag to compare
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-4 text-center">
        <p className="text-gray-700 font-medium">{caption}</p>
      </div>
    </div>
  );
}

export default function BeforeAfterGallery() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % beforeAfterPairs.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + beforeAfterPairs.length) % beforeAfterPairs.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 5000);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

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
            customers. Drag the slider to reveal the amazing pain relief power
            of Blue Scorpion.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
            aria-label="Previous transformation"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
            aria-label="Next transformation"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>

          {/* Slides */}
          <div className="relative overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5 }}
                className="px-4 lg:px-8"
              >
                <BeforeAfterSlider
                  beforeImage={beforeAfterPairs[currentSlide].before}
                  afterImage={beforeAfterPairs[currentSlide].after}
                  beforeAlt={beforeAfterPairs[currentSlide].beforeAlt}
                  afterAlt={beforeAfterPairs[currentSlide].afterAlt}
                  caption={beforeAfterPairs[currentSlide].caption}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {beforeAfterPairs.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? "bg-brand-primary scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-gray-200"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-primary mb-2">
                24
              </div>
              <div className="text-sm text-gray-600">Hours to feel relief</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-primary mb-2">
                89%
              </div>
              <div className="text-sm text-gray-600">Pain reduction</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-primary mb-2">
                92%
              </div>
              <div className="text-sm text-gray-600">Mobility improvement</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-primary mb-2">
                96%
              </div>
              <div className="text-sm text-gray-600">Overall satisfaction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
