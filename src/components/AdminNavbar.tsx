"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Content", href: "/admin/content" },
  { label: "Sports", href: "/admin/sports" },
  { label: "Ailments", href: "/admin/ailments" },
];

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        className="fixed top-[30px] left-[40px] right-[40px] md:left-[100px] md:right-[100px] lg:left-[150px] lg:right-[150px] xl:left-[200px] xl:right-[200px] z-50 transition-all duration-300 rounded-full overflow-hidden backdrop-blur-md shadow-lg bg-white/90"
      >
        <div className="container-wide relative z-10">
          <div className="flex items-center justify-between h-16 lg:h-20 px-4 lg:px-8">
            {/* Left Side - Logo */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg transition-colors mr-3 hover:bg-black/10 text-black"
                aria-label="Toggle mobile menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <Link
                href="/admin"
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/blue-scorpion-venom-logo_h.png"
                  alt="Blue Scorpion Logo"
                  width={338}
                  height={100}
                  quality={100}
                  className="h-8 w-auto lg:h-10"
                />
              </Link>
            </div>

            {/* Center - Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors font-medium relative group text-black hover:text-black/70"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-black"></span>
                </Link>
              ))}
            </div>

            {/* Right Side - Exit Admin */}
            <div className="flex items-center">
              <Link
                href="/"
                className="bg-[#324785] text-white px-3 py-1.5 lg:px-6 lg:py-3 rounded-full hover:bg-[#2a3d70] transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-semibold text-sm lg:text-base"
              >
                <span className="hidden lg:inline">Exit Admin</span>
                <span className="lg:hidden">Exit</span>
              </Link>
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
              className="fixed top-0 right-0 h-full w-80 shadow-2xl z-[60] lg:hidden overflow-hidden bg-white"
            >
              <div className="p-6 relative z-10">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/blue-scorpion-venom-logo_h.png"
                      alt="Blue Scorpion Logo"
                      width={338}
                      height={100}
                      quality={100}
                      className="h-8 w-auto"
                    />
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg transition-colors hover:bg-black/10 text-black"
                    aria-label="Close mobile menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className="block transition-colors font-medium py-3 px-4 rounded-lg text-black hover:text-black/70 hover:bg-black/10"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Exit Admin */}
                <div className="mt-8 pt-8 border-t border-black/20">
                  <Link
                    href="/"
                    className="w-full bg-[#324785] text-white py-3 rounded-lg hover:bg-[#2a3d70] transition-all duration-300 flex items-center justify-center font-semibold"
                  >
                    Exit Admin Panel
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
