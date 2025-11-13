"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(path);
  };

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/content", label: "Content" },
    { href: "/admin/sports", label: "Sports" },
    { href: "/admin/ailments", label: "Ailments" },
  ];

  return (
    <nav className="space-y-1">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive(link.href)
              ? "text-gray-900 bg-gray-100"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
