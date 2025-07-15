"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface TextMessage {
  id: string;
  image: string;
  customerName?: string;
  alt: string;
  filename?: string;
}

interface TextMessageCardProps {
  message: TextMessage;
}


export default function TextMessageCard({ message }: TextMessageCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };


  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 group"
    >


      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm">Loading...</div>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center">
            <div className="text-gray-400 mb-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            <div className="text-gray-500 text-xs text-center px-4">
              Message Screenshot
            </div>
          </div>
        ) : (
          <Image
            src={message.image}
            alt={message.alt}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}

      </div>

    </motion.div>
  );
}