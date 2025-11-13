import { ObjectId } from "mongodb";

// Content Collection (Testimonials + Raw Footage)
export interface Content {
  _id: ObjectId;
  slug: string;
  title: string;
  description?: string;

  // Content Type
  contentType: "testimonial" | "raw-footage" | "content";

  // Media
  mediaType: "image" | "video";
  mediaUrls: string[]; // Vercel Blob URLs
  thumbnailUrl?: string;

  // Tags - references to Sports and Ailments
  sports: string[]; // sport slugs: ['ufc', 'nba', 'nfl']
  ailments: string[]; // ailment slugs: ['joint-pain', 'inflammation']

  // Attribution
  athleteName?: string;
  source?: string; // 'user-submitted', 'instagram', 'vercel-blob', etc.

  // Metadata
  featured: boolean;
  priority: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Sports Collection (Tags/Categories)
export interface Sport {
  _id: ObjectId;
  slug: string;
  name: string; // 'UFC', 'NBA', 'NFL', 'MLB', etc.
  description?: string;

  // Visual
  iconUrl?: string;
  color?: string; // hex color for tag display

  // Meta
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Ailments Collection (Tags/Categories)
export interface Ailment {
  _id: ObjectId;
  slug: string;
  name: string; // 'Joint Pain', 'Inflammation', etc.
  description: string;

  // Related
  category: "joint" | "muscle" | "recovery" | "general";

  // Visual
  iconUrl?: string;
  color?: string; // hex color for tag display

  // Meta
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Database Collections
export interface Collections {
  content: Content;
  sports: Sport;
  ailments: Ailment;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next_page: boolean;
  };
  count: number;
}

// Query Types
export interface ContentQuery {
  contentType?: "testimonial" | "raw-footage" | "content";
  sport?: string;
  ailment?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  skip?: number;
  sort?: string;
}
