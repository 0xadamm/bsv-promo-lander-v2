"use client";

import Image from "next/image";

const navItems = [
  { label: "Instagram", href: "#instagram" },
  { label: "Wall of Love", href: "#testimonials" },
  { label: "Before & After", href: "#before-after" },
  { label: "Press & News", href: "#press-news" },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/bluescorpionvenom",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z" />
      </svg>
    )
  },
  {
    name: "Facebook",
    href: "https://facebook.com/bluescorpionvenom",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  }
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container-wide">
        
        {/* Simple single row layout */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
          
          {/* Logo */}
          <div>
            <Image
              src="/blue-scorpion-venom-logo-h-white.png"
              alt="Blue Scorpion Logo"
              width={160}
              height={50}
              className="h-12 w-auto"
            />
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Social */}
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>

        </div>

        {/* Full disclaimer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="text-gray-500 text-xs leading-relaxed space-y-3">
            <p className="font-semibold">DISCLAIMER:</p>
            <p>
              The testimonials, reviews, and endorsements featured on this website and in our marketing materials reflect the individual experiences and personal opinions of real users of Blue Scorpion Pain & Inflammation Relief. Individual results may vary.
            </p>
            <p>
              These statements are not intended to diagnose, treat, cure, or prevent any disease and have not been evaluated by the Food and Drug Administration (FDA).
            </p>
            <p>
              Some testimonials may be from individuals who received complimentary product samples in exchange for their honest feedback. Others may involve influencers or brand ambassadors who were compensated for their time and exposure. Regardless of compensation, all feedback presented is based on the individual&apos;s genuine experience with our product.
            </p>
            <p>
              We do not claim that any testimonial is representative of all users. Results will vary depending on individual circumstances, body chemistry, and adherence to suggested use.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Blue Scorpion. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}