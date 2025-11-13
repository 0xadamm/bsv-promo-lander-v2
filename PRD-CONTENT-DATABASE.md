# PRD: Content Database System

**Project:** BSV Promo Lander v2  
**Date:** November 12, 2025  
**Status:** Planning

---

## Key Scope

**Four Collections:**

1. **Sports** (UFC, NBA, NFL, MLB, etc.)
2. **Ailments** (Joint Pain, Inflammation, etc.)
3. **Testimonials** (main content type)
4. **Raw Footage** (unedited content)

**Page Structure:**

- **Admin Interface** at `/admin` - Upload and manage all content (no auth for MVP)
  - Dashboard, content manager, sports/ailments managers
- **Public Database** at `/database` - View all content in wall-of-love grid
  - All content shown together (testimonials + raw footage)
  - Each card has tags: content type, sports, ailments
  - Filter by clicking tags
  - Infinite scroll with "Load More" button

**Important:**

- This is a **new `/database` page** - the existing landing page remains unchanged
- **No integration** with Senja/Stamped on this page
- Fresh start with new content

---

## 1. Overview

Build a unified content database page for Blue Scorpion Venom displaying all content in a single grid (wall-of-love style). Users can filter by sports, ailments, and content type. This is a **separate section** from the existing landing page.

### Current State

- Existing landing page (remains untouched)
- Vercel Blob already installed
- No database layer

### Target State

- New `/database` page with unified content grid
- MongoDB-backed content system (4 collections: Sports, Ailments, Testimonials, Raw Footage)
- Admin interface for content management
- Public-facing filterable grid with tag-based filtering
- All content types shown together on one page

---

## 2. Goals & Success Criteria

### Primary Goals

1. Create a dedicated content database separate from the landing page
2. Display all content (testimonials + raw footage) in one unified grid
3. Enable non-technical team members to manage content
4. Allow users to filter content by sport, ailment, and content type
5. Provide wall-of-love style browsing experience

### Success Metrics

- Admin can add new content in <3 minutes
- Page load time <2s for database grid
- Support 1000+ content items without performance degradation
- Smooth filtering without page reload
- Clean separation from existing landing page

---

## 3. Database Schema

### 3.1 Collections

#### **Content Collection** (Testimonials + Raw Footage)

```typescript
{
  _id: ObjectId,
  slug: string (unique, indexed),
  title: string (required),
  description: string,

  // Content Type
  contentType: 'testimonial' | 'raw-footage' (required),

  // Media
  mediaType: 'image' | 'video' | 'text',
  mediaUrls: string[], // Vercel Blob URLs
  thumbnailUrl: string,

  // Tags - references to Sports and Ailments
  sports: string[], // sport slugs: ['ufc', 'nba', 'nfl']
  ailments: string[], // ailment slugs: ['joint-pain', 'inflammation']

  // Attribution
  athleteName?: string, // Optional: specific athlete name
  source?: string, // 'user-submitted', 'instagram', etc.

  // Metadata
  featured: boolean (default: false),
  priority: number (default: 0, for sorting),
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date,
}
```

#### **Sports Collection** (Tags/Categories)

```typescript
{
  _id: ObjectId,
  slug: string (unique, indexed),
  name: string (required), // 'UFC', 'NBA', 'NFL', 'MLB', etc.
  description: string,

  // Visual
  iconUrl: string,
  color: string, // hex color for tag display

  // Meta
  displayOrder: number (default: 0),
  createdAt: Date,
  updatedAt: Date,
}
```

#### **Ailments Collection** (Tags/Categories)

```typescript
{
  _id: ObjectId,
  slug: string (unique, indexed),
  name: string (required), // 'Joint Pain', 'Inflammation', etc.
  description: string (required),

  // Related
  category: string, // 'joint', 'muscle', 'recovery', 'general'

  // Visual
  iconUrl: string,
  color: string, // hex color for tag display

  // Meta
  displayOrder: number (default: 0),
  createdAt: Date,
  updatedAt: Date,
}
```

### 3.2 Indexes

- `Content`: slug, publishedAt, featured, contentType, sports, ailments
- `Sports`: slug, displayOrder
- `Ailments`: slug, category, displayOrder

---

## 4. API Endpoints

### 4.1 Content API

| Method | Endpoint            | Purpose                         | Auth Required |
| ------ | ------------------- | ------------------------------- | ------------- |
| GET    | `/api/content`      | List all content (with filters) | No            |
| GET    | `/api/content/[id]` | Get single content item         | No            |
| POST   | `/api/content`      | Create new content              | Yes (Admin)   |
| PUT    | `/api/content/[id]` | Update content                  | Yes (Admin)   |
| DELETE | `/api/content/[id]` | Delete content                  | Yes (Admin)   |

**Query Parameters for GET /api/content:**

- `contentType`: string ('testimonial' | 'raw-footage')
- `sport`: string (slug)
- `ailment`: string (slug)
- `featured`: boolean
- `search`: string (search title/description)
- `limit`: number (default: 50)
- `skip`: number (for pagination)
- `sort`: string (default: '-publishedAt')

### 4.2 Sports API

| Method | Endpoint             | Purpose           | Auth Required |
| ------ | -------------------- | ----------------- | ------------- |
| GET    | `/api/sports`        | List all sports   | No            |
| GET    | `/api/sports/[slug]` | Get sport details | No            |
| POST   | `/api/sports`        | Create sport      | Yes (Admin)   |
| PUT    | `/api/sports/[slug]` | Update sport      | Yes (Admin)   |
| DELETE | `/api/sports/[slug]` | Delete sport      | Yes (Admin)   |

### 4.3 Ailments API

| Method | Endpoint               | Purpose             | Auth Required |
| ------ | ---------------------- | ------------------- | ------------- |
| GET    | `/api/ailments`        | List all ailments   | No            |
| GET    | `/api/ailments/[slug]` | Get ailment details | No            |
| POST   | `/api/ailments`        | Create ailment      | Yes (Admin)   |
| PUT    | `/api/ailments/[slug]` | Update ailment      | Yes (Admin)   |
| DELETE | `/api/ailments/[slug]` | Delete ailment      | Yes (Admin)   |

### 4.4 Upload API

| Method | Endpoint      | Purpose                     | Auth Required |
| ------ | ------------- | --------------------------- | ------------- |
| POST   | `/api/upload` | Upload media to Vercel Blob | Yes (Admin)   |

**Request:** multipart/form-data  
**Response:** `{ url: string, pathname: string }`

---

## 5. Application Structure

### 5.1 New Files Required

```
src/
├── lib/
│   ├── mongodb.ts                    # MongoDB connection singleton
│   ├── db/
│   │   ├── content.ts               # Content CRUD operations
│   │   ├── sports.ts                # Sports CRUD operations
│   │   └── ailments.ts              # Ailments CRUD operations
│   └── validators/
│       ├── content.ts               # Zod schemas for validation
│       ├── sport.ts
│       └── ailment.ts
├── types/
│   └── database.ts                  # TypeScript interfaces
├── app/
│   ├── database/                    # NEW PUBLIC PAGE
│   │   └── page.tsx                # Single page with content grid
│   ├── admin/
│   │   ├── layout.tsx              # Admin shell with auth check
│   │   ├── page.tsx                # Admin dashboard (stats)
│   │   ├── content/
│   │   │   ├── page.tsx            # Content list/table
│   │   │   ├── new/page.tsx        # Create content
│   │   │   └── [id]/page.tsx       # Edit content
│   │   ├── sports/
│   │   │   ├── page.tsx            # Sports list
│   │   │   ├── new/page.tsx        # Create sport
│   │   │   └── [slug]/page.tsx     # Edit sport
│   │   └── ailments/
│   │       ├── page.tsx            # Ailments list
│   │       ├── new/page.tsx        # Create ailment
│   │       └── [slug]/page.tsx     # Edit ailment
├── components/
│   ├── admin/
│   │   ├── ContentForm.tsx         # Content editor
│   │   ├── SportForm.tsx           # Sport editor
│   │   ├── AilmentForm.tsx         # Ailment editor
│   │   ├── MediaUploader.tsx       # Drag-drop upload
│   │   ├── TagSelector.tsx         # Multi-select for tags
│   │   └── DataTable.tsx           # Sortable table component
│   ├── database/
│   │   ├── ContentGrid.tsx         # Main grid layout (wall of love style)
│   │   ├── ContentCard.tsx         # Individual content card with tags
│   │   ├── FilterBar.tsx           # Top filter bar with tag pills
│   │   ├── ContentModal.tsx        # Lightbox for full content view
│   │   └── TagBadge.tsx            # Reusable tag component
│   └── shared/
│       ├── Pagination.tsx
│       └── LoadingSpinner.tsx
```

### 5.2 Modified Files

- `next.config.ts` - Add Blob and MongoDB env vars
- `.env.local` (create) - Add secrets
- `package.json` - Add new dependencies

---

## 6. UI/UX Components

**Two Main Sections:**

1. **Admin Section** (`/admin/*`) - For you to upload and manage content

   - No auth required for MVP (can add later)
   - Full CRUD interface
   - Upload media, create sports/ailments, manage everything

2. **Public Database** (`/database`) - For anyone to view content
   - No login required
   - Wall-of-love grid with all content
   - Filtering by tags

---

### 6.1 Admin Interface (`/admin/*`)

#### **Dashboard Home** (`/admin`)

- Overview stats (total content items, sports, ailments)
- Content breakdown: X testimonials, Y raw footage
- Recent uploads (last 10 content items)
- Quick actions (+ New Content, + New Sport, + New Ailment)

#### **Content Manager** (`/admin/content`)

- Sortable table with columns:
  - Thumbnail
  - Title
  - Content Type (badge: testimonial/raw-footage)
  - Media Type (badge: image/video/text)
  - Sports (pills)
  - Ailments (pills)
  - Published date
  - Actions (Edit | Delete)
- Filters: Content Type, Media Type, Sport, Ailment, Featured
- Search by title or athlete name
- Bulk actions (delete, feature/unfeature)

#### **Content Editor** (`/admin/content/new` or `/admin/content/[id]`)

Form fields:

- Content Type (radio: testimonial | raw-footage) **REQUIRED**
- Title (text input)
- Description (textarea)
- Media Upload (drag-drop, multiple files)
- Media Type (select: image/video/text)
- Sports Tags (multi-select dropdown)
- Ailments Tags (multi-select dropdown)
- Athlete Name (optional text input)
- Source (optional text input)
- Featured (toggle)
- Priority (number input)
- Publish Date (date picker)

#### **Sports Manager** (`/admin/sports`)

- Grid/table view
- Columns: Icon, Name, Color, Display Order, Actions
- Quick add button
- Drag-to-reorder for displayOrder

#### **Sport Editor** (`/admin/sports/new` or `/admin/sports/[slug]`)

Form fields:

- Name (text input, e.g., "UFC", "NBA")
- Description (textarea)
- Icon (upload)
- Color (color picker - for tag display)
- Display Order (number input)

#### **Ailments Manager** (`/admin/ailments`)

- Grid/table view
- Columns: Icon, Name, Category, Color, Display Order, Actions
- Quick add button
- Drag-to-reorder for displayOrder

#### **Ailment Editor** (`/admin/ailments/new` or `/admin/ailments/[slug]`)

Form fields:

- Name (text input, e.g., "Joint Pain")
- Description (textarea)
- Category (select: joint/muscle/recovery/general)
- Icon (upload)
- Color (color picker - for tag display)
- Display Order (number input)

### 6.2 Public Database (`/database`)

#### **Content Wall Page** - **SINGLE PUBLIC PAGE**

**Layout:**

- Hero section: "Content Database" heading + tagline
- Stats bar: Total content items, sports covered, ailments addressed

**Design Note:** Masonry grid handles both horizontal (16:9, 4:3) and vertical (9:16, 4:5) content seamlessly

**Filter Bar (Fixed at top):**

- "All Content" button (active by default)
- Content Type filters: [ Testimonials ] [ Raw Footage ]
- Sport tag pills (clickable): [ UFC ] [ NBA ] [ NFL ] ... (scrollable)
- Ailment tag pills (clickable): [ Joint Pain ] [ Inflammation ] ... (scrollable)
- "Clear Filters" button
- Search input

**Content Grid (Wall of Love Style):**

- **Masonry layout** (Pinterest-style) to handle mixed aspect ratios
  - Supports both horizontal (landscape) and vertical (portrait) content
  - Responsive columns: 1 col (mobile), 2 cols (tablet), 3-4 cols (desktop)
  - Items maintain original aspect ratio
- Infinite scroll with "Load More" button
- Each content card shows:
  - **Thumbnail** (image/video preview - maintains aspect ratio)
  - **Title**
  - **Tag badges** (styled with colors):
    - Content type badge (testimonial/raw-footage)
    - Sport tags (if any)
    - Ailment tags (if any)
  - Hover effect → shows description preview + overlay
  - Click → opens modal with full content

**Content Modal:**

- Full-screen or large modal
- Full media display (image/video)
- Title and full description
- All tags displayed prominently
- Athlete name (if available)
- Close button
- Next/Previous buttons to browse through filtered results
- Share button (optional)

**UX Features:**

- Click any tag on a card → filters by that tag
- URL updates with query params (for sharing filtered views)
- Smooth animations on filter changes
- Loading skeleton while fetching
- Empty state when no results

**SEO:**

- Meta tags for `/database` page
- OpenGraph image
- Structured data for content items

---

## 7. Technical Requirements

### 7.1 Dependencies to Add

```json
{
  "dependencies": {
    "mongodb": "^6.0.0",
    "zod": "^3.22.0",
    "slugify": "^1.6.0",
    "date-fns": "^3.0.0",
    "react-masonry-css": "^1.0.16"
  },
  "devDependencies": {
    "@types/mongodb": "^4.0.7"
  }
}
```

### 7.2 Environment Variables

```bash
# .env.local
MONGODB_URI=mongodb+srv://...
MONGODB_DB=bsv-content

BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Admin Auth (simple password for MVP)
ADMIN_PASSWORD=your-secure-password

# Optional: More robust auth later
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
```

### 7.3 MongoDB Setup

- **Provider:** MongoDB Atlas (Free M0 cluster sufficient for start)
- **Regions:** US-East-1 (or closest to Vercel deployment)
- **Backup:** Enable automated backups
- **Network:** Allow Vercel IPs or 0.0.0.0/0 for serverless

### 7.4 Vercel Configuration

- Add environment variables in Vercel dashboard
- Enable Blob storage (if not already)
- Set up preview environments for testing

---

## 8. Authentication & Authorization

### MVP: No Authentication

- Admin pages (`/admin/*`) are open for MVP
- Can implement auth later when needed
- Keeps initial development simple and fast

### Future: Authentication (Phase 2)

**Option 1: Simple Password Protection**

- Single admin password in env var
- Session cookie after login
- Middleware to protect `/admin` routes

**Option 2: Full Auth**

- NextAuth.js with Google/GitHub OAuth
- User roles: Admin, Editor, Viewer
- Per-user activity logging

---

## 9. Initial Data Setup

### 9.1 Pre-populate Sports

Create initial sports entries via admin interface:

- UFC
- NBA
- NFL
- MLB
- Boxing
- MMA
- Hockey
- Soccer
- Tennis
- Golf

### 9.2 Pre-populate Ailments

Create initial ailment entries categorized by type:

**Joint:**

- Joint Pain
- Arthritis
- Knee Pain
- Hip Pain

**Muscle:**

- Muscle Soreness
- Muscle Recovery
- Muscle Inflammation

**Recovery:**

- Post-Workout Recovery
- Injury Recovery
- General Inflammation

**General:**

- Chronic Pain
- Back Pain
- Neck Pain

---

## 10. Implementation Phases

### **Phase 1: Foundation** (Days 1-2)

- [ ] Install MongoDB package and dependencies (zod, slugify)
- [ ] Create MongoDB connection utility (`lib/mongodb.ts`)
- [ ] Define TypeScript types/interfaces (`types/database.ts`)
- [ ] Create database utility functions (CRUD) for all 3 collections (Content, Sports, Ailments)
- [ ] Set up environment variables

### **Phase 2: API Development** (Days 3-4)

- [ ] Build Content API (full CRUD with contentType filtering)
- [ ] Build Sports API (full CRUD)
- [ ] Build Ailments API (full CRUD)
- [ ] Build upload API for Vercel Blob
- [ ] Add input validation with Zod schemas
- [ ] Test all endpoints with API client

### **Phase 3: Admin Interface** (Days 5-7)

- [ ] Create admin layout (no auth for MVP)
- [ ] Build admin dashboard (stats overview)
- [ ] Build Content Manager (list/table with filters)
- [ ] Build Content Editor form (with contentType selector + media upload)
- [ ] Build Sports Manager and Editor (with color picker)
- [ ] Build Ailments Manager and Editor (with color picker)
- [ ] Test end-to-end admin workflow

### **Phase 4: Public Database Page** (Days 8-10)

- [ ] Build `/database` single page layout
- [ ] Create FilterBar component (content type, sports, ailments)
- [ ] Build ContentGrid component (masonry/grid layout)
- [ ] Build ContentCard component with tag badges
- [ ] Implement tag filtering (client-side or API)
- [ ] Add ContentModal for full view
- [ ] Implement infinite scroll or pagination
- [ ] URL query param syncing for filters

### **Phase 5: Polish & Optimization** (Days 11-12)

- [ ] Pre-populate sports and ailments via seeding script
- [ ] Add loading states and error handling
- [ ] Responsive design refinements (mobile-first)
- [ ] Performance optimization (ISR, image optimization)
- [ ] Add SEO metadata
- [ ] Smooth animations for filter changes
- [ ] Test across devices and browsers

### **Phase 6: Launch** (Day 13)

- [ ] Final QA pass
- [ ] Deploy to production (Vercel)
- [ ] Verify MongoDB Atlas connection
- [ ] Monitor for errors
- [ ] Train team on admin interface
- [ ] Add link to `/database` from landing page nav

---

## 11. Non-Functional Requirements

### Performance

- Page load time <2s (LCP)
- API response time <500ms (p95)
- Image optimization (automatic via Vercel Blob)
- Use Next.js ISR for content pages (revalidate: 60s)

### SEO

- Meta tags and OpenGraph for `/database` page
- Dynamic title based on active filters (e.g., "UFC Testimonials | BSV Database")
- Schema.org markup:
  - ItemList schema for content grid
  - Individual VideoObject/ImageObject for content items
  - Review schema for testimonials
- Canonical URL (with normalized query params)
- Rich snippets for content (author, datePublished if available)

### Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader friendly
- Alt text for all images

### Security

- Input validation (Zod schemas)
- Rate limiting on API routes (future)
- CORS configuration
- Sanitize user inputs (XSS prevention)

---

## 12. Future Enhancements (Out of Scope for V1)

- **Admin Authentication** - Password protection or OAuth for `/admin` pages
- **AI-powered tagging** - Auto-suggest sports/ailments from media content
- **Analytics dashboard** - Track content views, popular sports/ailments
- **User submissions** - Public form for customers to submit testimonials
- **Ratings/Reviews** - Add star ratings to testimonials
- **Video transcription** - Auto-generate captions for video testimonials
- **Advanced search** - Full-text search with Elasticsearch/Algolia
- **Scheduled publishing** - Queue content for future dates
- **Revision history** - Track changes to content/sports/ailments
- **Instagram integration** - Auto-import testimonials from Instagram tagged content
- **Multi-language support** - Spanish, French, etc.
- **Content moderation** - Draft/published workflow with approval

---

## 13. Risks & Mitigations

| Risk                             | Impact | Probability | Mitigation                              |
| -------------------------------- | ------ | ----------- | --------------------------------------- |
| MongoDB Atlas downtime           | High   | Low         | Use connection pooling, retry logic     |
| Blob storage costs exceed budget | Medium | Medium      | Implement compression, set size limits  |
| Poor testimonial discoverability | High   | Medium      | Invest in good UX for filters/search    |
| Admin complexity/adoption        | Medium | High        | Keep UI simple, add onboarding tooltips |
| Slow page load with many items   | Medium | Medium      | Implement pagination, ISR, lazy loading |

---

## 14. Open Questions

1. **Content Approval:** Should content have draft/published workflow or go live immediately?
2. **Analytics:** Track views per content item, popular tags from day 1?
3. **Video Hosting:** Store all videos on Vercel Blob, or support YouTube/Vimeo embeds too?
4. **Landing Page Link:** Where should we add the link to `/database` in the main landing page navigation?
5. **Filter UX:** Should filters be client-side (fast) or server-side (better for large datasets)?
6. **Tag Colors:** Pre-define colors for sports/ailments or let admin choose via color picker?
7. **Load More:** Infinite scroll auto-load or manual "Load More" button?

---

## 15. Sign-off

**Stakeholders:**

- [ ] Product Owner
- [ ] Engineering Lead
- [ ] Design Lead
- [ ] Marketing Team

**Estimated Timeline:** 13 working days  
**Budget:** ~$0 infra cost (Free tiers for MongoDB + Vercel Blob sufficient initially)

---

_End of PRD_
