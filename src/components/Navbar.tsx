"use client";

import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Instagram", href: "#instagram" },
  { label: "Wall of Love", href: "#testimonials" },
  { label: "Before & After", href: "#before-after" },
  { label: "Press & News", href: "#press-news" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("center bottom");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const navbarHeight = 80; // h-16 = 64px on mobile, h-20 = 80px on desktop

      // Show hero background when navbar is about to leave hero section
      const showBackground = scrollY > heroHeight - navbarHeight;
      setIsScrolledPastHero(showBackground);

      if (showBackground) {
        // Calculate how much the hero should appear to have scrolled up
        const scrollBeyondTrigger = scrollY - (heroHeight - navbarHeight);
        const maxScroll = navbarHeight; // Hero can scroll up to navbar height
        const scrollProgress = Math.min(scrollBeyondTrigger / maxScroll, 1);

        // Position the background so it appears to scroll up from bottom
        const yOffset = (1 - scrollProgress) * 100; // 100% to 0%
        setBackgroundPosition(`center ${yOffset}%`);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking on link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
    <nav
      className={`fixed top-[10px] left-[10px] right-[10px] z-50 transition-all duration-300 rounded-2xl lg:rounded-3xl overflow-hidden ${
        isScrolledPastHero ? "backdrop-blur-md shadow-lg" : ""
      }`}
      style={
        isScrolledPastHero
          ? {
              backgroundImage: `url('/blue-scorpion-venom-hero.png')`,
              backgroundSize: "cover",
              backgroundPosition: backgroundPosition,
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      {/* Blue tint overlay - only when scrolled past hero */}
      {isScrolledPastHero && (
        <div className="absolute inset-0 bg-[#324785]/80" />
      )}

      <div className="container-wide relative z-10">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left Side - Mobile Hamburger / Desktop Navigation */}
          <div className="flex items-center justify-start w-24 lg:w-auto lg:flex-1 lg:justify-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors hover:bg-white/10 text-white"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-12">
              {navItems.slice(0, 2).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-white hover:text-white/80 transition-colors font-medium relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Center Logo */}
          <div className="flex items-center justify-center flex-shrink-0">
            <a
              href="#"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/blue-scorpion-venom-logo-h-white.png"
                alt="Blue Scorpion Logo"
                width={120}
                height={40}
                className="h-8 w-auto lg:h-12"
              />
            </a>
          </div>

          {/* Right Side - CTA Button / Desktop Navigation */}
          <div className="flex items-center justify-end w-24 lg:w-auto lg:flex-1 lg:justify-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-12">
              {navItems.slice(2).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-white hover:text-white/80 transition-colors font-medium relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* CTA Button - Always visible */}
            <a href="https://bluescorpion.com/products/pain-and-inflammation-relief" className="bg-[#324785] text-white px-3 py-1.5 lg:px-6 lg:py-3 rounded-lg hover:bg-[#2a3d70] transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-semibold text-sm lg:text-base">
              <ShoppingBag size={16} className="lg:w-[18px] lg:h-[18px]" />
              <span className="hidden lg:inline lg:ml-2">Shop Now</span>
            </a>
          </div>
        </div>
      </div>
    </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 shadow-2xl z-[60] lg:hidden overflow-hidden"
              style={
                isScrolledPastHero
                  ? {
                      backgroundImage: `url('/blue-scorpion-venom-hero.png')`,
                      backgroundSize: "cover",
                      backgroundPosition: backgroundPosition,
                      backgroundRepeat: "no-repeat",
                    }
                  : {}
              }
            >
              {/* Background overlay for mobile menu */}
              <div
                className={`absolute inset-0 ${
                  isScrolledPastHero ? "bg-[#324785]/90" : "bg-[#324785]/95"
                }`}
              />
              <div className="p-6 relative z-10">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/blue-scorpion-venom-logo-h-white.png"
                      alt="Blue Scorpion Logo"
                      width={120}
                      height={32}
                      className="h-8 w-auto"
                    />
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                    aria-label="Close mobile menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="block text-white hover:text-white/80 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/10"
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="mt-8 pt-8 border-t border-white/20">
                  <a href="https://bluescorpion.com/products/pain-and-inflammation-relief" className="w-full bg-brand-primary text-white py-3 rounded-lg hover:bg-brand-accent transition-all duration-300 flex items-center justify-center space-x-2 font-semibold">
                    <ShoppingBag size={18} />
                    <span>Order Now</span>
                  </a>
                </div>

                {/* Social Links */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="text-sm text-white/60 mb-4">Follow Us</div>
                  <div className="flex space-x-4">
                    <a
                      href="https://instagram.com/bluescorpionvenom"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href="https://facebook.com/bluescorpionvenom"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
