// Sample data for Blue Scorpion landing page

export interface InstagramPost {
  id: string;
  image: string;
  url: string;
  alt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  quote: string;
  rating?: number;
}

export interface VideoTestimonial {
  id: string;
  name: string;
  avatar: string;
  videoUrl: string;
  thumbnailImage: string;
  duration: string;
  title: string;
  location?: string;
}

export interface BeforeAfterPair {
  id: string;
  before: string;
  after: string;
  caption: string;
  beforeAlt: string;
  afterAlt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface PressLogo {
  id: string;
  name: string;
  logo: string;
  url: string;
  alt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  url: string;
  date: string;
  readTime: string;
}

// Instagram Posts
export const instagramPosts: InstagramPost[] = [
  {
    id: "1",
    image: "/images/instagram/post1.jpg",
    url: "https://instagram.com/bluescorpion/post1",
    alt: "Blue Scorpion pain relief cream application",
  },
  {
    id: "2",
    image: "/images/instagram/post2.jpg",
    url: "https://instagram.com/bluescorpion/post2",
    alt: "Customer showing pain-free movement after using Blue Scorpion",
  },
  {
    id: "3",
    image: "/images/instagram/post3.jpg",
    url: "https://instagram.com/bluescorpion/post3",
    alt: "Blue Scorpion anti-inflammatory formula bottle",
  },
  {
    id: "4",
    image: "/images/instagram/post4.jpg",
    url: "https://instagram.com/bluescorpion/post4",
    alt: "Before and after mobility improvement demonstration",
  },
  {
    id: "5",
    image: "/images/instagram/post5.jpg",
    url: "https://instagram.com/bluescorpion/post5",
    alt: "Blue Scorpion complete pain relief kit",
  },
  {
    id: "6",
    image: "/images/instagram/post6.jpg",
    url: "https://instagram.com/bluescorpion/post6",
    alt: "Happy customer pain relief testimonial video",
  },
];

// Testimonials for Wall of Love
export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/images/avatars/sarah.jpg",
    quote:
      "Blue Scorpion completely eliminated my chronic back pain! I felt relief in just hours. After 2 weeks, I'm pain-free for the first time in years.",
    rating: 5,
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/images/avatars/michael.jpg",
    quote:
      "As an athlete in my 40s, I deal with constant joint pain. Blue Scorpion changed everything. My knees feel 20 years younger!",
    rating: 5,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    avatar: "/images/avatars/emily.jpg",
    quote:
      "The anti-inflammatory formula is pure magic. Friends keep asking how I'm so active again - Blue Scorpion gave me my life back!",
    rating: 5,
  },
  {
    id: "4",
    name: "David Thompson",
    avatar: "/images/avatars/david.jpg",
    quote:
      "I've tried countless pain relief products. Blue Scorpion is the only one that actually delivered lasting results. Incredible relief!",
    rating: 5,
  },
  {
    id: "5",
    name: "Lisa Wang",
    avatar: "/images/avatars/lisa.jpg",
    quote:
      "The fast absorption, long-lasting relief, amazing results - everything about Blue Scorpion is perfect. Worth every penny!",
    rating: 5,
  },
  {
    id: "6",
    name: "Robert Martinez",
    avatar: "/images/avatars/robert.jpg",
    quote:
      "My doctor was amazed at my mobility improvement. Blue Scorpion is now a permanent part of my pain management routine.",
    rating: 5,
  },
];

// Video Testimonials for Wall of Love
export const videoTestimonials: VideoTestimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/images/avatars/sarah.jpg",
    videoUrl: "/videos/testimonials/sarah-testimonial.mp4",
    thumbnailImage: "/images/video-thumbnails/sarah-thumb.jpg",
    duration: "1:24",
    title: "My 8-week pain relief journey with Blue Scorpion",
    location: "Los Angeles, CA",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/images/avatars/michael.jpg",
    videoUrl: "/videos/testimonials/michael-testimonial.mp4",
    thumbnailImage: "/images/video-thumbnails/michael-thumb.jpg",
    duration: "2:15",
    title: "Why I switched to Blue Scorpion for joint pain",
    location: "New York, NY",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    avatar: "/images/avatars/emily.jpg",
    videoUrl: "/videos/testimonials/emily-testimonial.mp4",
    thumbnailImage: "/images/video-thumbnails/emily-thumb.jpg",
    duration: "1:45",
    title: "The anti-inflammatory that changed everything",
    location: "Miami, FL",
  },
  {
    id: "4",
    name: "David Thompson",
    avatar: "/images/avatars/david.jpg",
    videoUrl: "/videos/testimonials/david-testimonial.mp4",
    thumbnailImage: "/images/video-thumbnails/david-thumb.jpg",
    duration: "2:03",
    title: "Real results from Blue Scorpion pain relief formula",
    location: "Chicago, IL",
  },
  {
    id: "5",
    name: "Lisa Wang",
    avatar: "/images/avatars/lisa.jpg",
    videoUrl: "/videos/testimonials/lisa-testimonial.mp4",
    thumbnailImage: "/images/video-thumbnails/lisa-thumb.jpg",
    duration: "1:52",
    title: "My physical therapist recommended Blue Scorpion",
    location: "San Francisco, CA",
  },
  {
    id: "6",
    name: "Robert Martinez",
    avatar: "/images/avatars/robert.jpg",
    videoUrl: "/videos/testimonials/robert-testimonial.mp4",
    thumbnailImage: "/images/video-thumbnails/robert-thumb.jpg",
    duration: "1:38",
    title: "From chronic pain to pain-free - Blue Scorpion works",
    location: "Austin, TX",
  },
];

// Before & After Gallery
export const beforeAfterPairs: BeforeAfterPair[] = [
  {
    id: "1",
    before:
      "https://assets.cdn.filesafe.space/fBGk1UDgdKTuWK0ynoO8/media/6800125bb32b5b4412cc48a7.jpeg",
    after:
      "https://assets.cdn.filesafe.space/fBGk1UDgdKTuWK0ynoO8/media/6800125bf5021488943c17c7.jpeg",
    caption: "Sarah, 45 - 8 weeks of Blue Scorpion treatment",
    beforeAlt: "Before: limited mobility due to chronic pain",
    afterAlt: "After: full range of motion with pain-free movement",
  },
  {
    id: "2",
    before: "/images/before-after/before2.jpg",
    after: "/images/before-after/after2.jpg",
    caption: "Michael, 52 - 6 weeks of consistent use",
    beforeAlt: "Before: struggling with joint stiffness and pain",
    afterAlt: "After: active lifestyle with improved mobility",
  },
  {
    id: "3",
    before: "/images/before-after/before3.jpg",
    after: "/images/before-after/after3.jpg",
    caption: "Emily, 38 - 4 weeks transformation",
    beforeAlt: "Before: chronic inflammation and discomfort",
    afterAlt: "After: pain-free daily activities and exercise",
  },
  {
    id: "4",
    before: "/images/before-after/before4.jpg",
    after: "/images/before-after/after4.jpg",
    caption: "David, 49 - 10 weeks of Blue Scorpion",
    beforeAlt: "Before: severe back pain affecting daily life",
    afterAlt: "After: return to active lifestyle without pain",
  },
];

// 5-Star Reviews
export const reviews: Review[] = [
  {
    id: "1",
    name: "Jennifer Walsh",
    rating: 5,
    text: "The most effective pain relief product I've ever used. My chronic pain is completely gone!",
    date: "2024-01-15",
  },
  {
    id: "2",
    name: "Mark Stevens",
    rating: 5,
    text: "Incredible results in just one week. My joint inflammation is significantly reduced.",
    date: "2024-01-20",
  },
  {
    id: "3",
    name: "Amanda Foster",
    rating: 5,
    text: "Blue Scorpion exceeded all my expectations. I haven't felt this pain-free in years.",
    date: "2024-01-25",
  },
  {
    id: "4",
    name: "Thomas Clark",
    rating: 5,
    text: "Finally found a product that works for chronic pain! The relief is remarkable.",
    date: "2024-02-01",
  },
  {
    id: "5",
    name: "Rachel Green",
    rating: 5,
    text: "Worth every penny. My quality of life is back thanks to Blue Scorpion.",
    date: "2024-02-05",
  },
];

// Press Logos
export const pressLogos: PressLogo[] = [
  {
    id: "1",
    name: "WebMD",
    logo: "/images/press/webmd.svg",
    url: "https://webmd.com/blue-scorpion-review",
    alt: "WebMD logo",
  },
  {
    id: "2",
    name: "Healthline",
    logo: "/images/press/healthline.svg",
    url: "https://healthline.com/blue-scorpion-featured",
    alt: "Healthline logo",
  },
  {
    id: "3",
    name: "Mayo Clinic",
    logo: "/images/press/mayo-clinic.svg",
    url: "https://mayoclinic.org/blue-scorpion-pain-relief",
    alt: "Mayo Clinic logo",
  },
  {
    id: "4",
    name: "Medical News Today",
    logo: "/images/press/medical-news-today.svg",
    url: "https://medicalnewstoday.com/blue-scorpion-awards",
    alt: "Medical News Today logo",
  },
  {
    id: "5",
    name: "Harvard Health",
    logo: "/images/press/harvard-health.svg",
    url: "https://health.harvard.edu/blue-scorpion-health",
    alt: "Harvard Health logo",
  },
  {
    id: "6",
    name: "Pain Medicine Journal",
    logo: "/images/press/pain-medicine.svg",
    url: "https://painmedicine.com/blue-scorpion-tested",
    alt: "Pain Medicine Journal logo",
  },
];

// News Articles
export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title:
      "The Science Behind Blue Scorpion: Revolutionary Pain Relief Breakthrough",
    excerpt:
      "Discover the cutting-edge anti-inflammatory technology that makes Blue Scorpion the most effective pain relief solution on the market.",
    image: "/images/news/article1.jpg",
    url: "/news/science-behind-blue-scorpion",
    date: "2024-02-15",
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "Athletes' Secret Weapon: Why Professionals Choose Blue Scorpion",
    excerpt:
      "From Olympic athletes to professional sports teams, Blue Scorpion is trusted for rapid pain relief and recovery.",
    image: "/images/news/article2.jpg",
    url: "/news/athletes-pain-relief-secrets",
    date: "2024-02-10",
    readTime: "3 min read",
  },
  {
    id: "3",
    title:
      "Clinical Study Results: 98% of Users Experience Significant Pain Relief",
    excerpt:
      "Independent clinical trials prove Blue Scorpion delivers remarkable pain relief results in just 24 hours.",
    image: "/images/news/article3.jpg",
    url: "/news/clinical-study-results",
    date: "2024-02-05",
    readTime: "7 min read",
  },
  {
    id: "4",
    title: "Doctor Approved: Why Physicians Recommend Blue Scorpion",
    excerpt:
      "Leading pain management specialists explain why they recommend Blue Scorpion to their chronic pain patients.",
    image: "/images/news/article4.jpg",
    url: "/news/doctor-approved",
    date: "2024-02-01",
    readTime: "4 min read",
  },
];

// Aggregate rating data
export const aggregateRating = {
  average: 4.9,
  total: 1247,
  breakdown: {
    5: 1156,
    4: 78,
    3: 13,
    2: 0,
    1: 0,
  },
};

// Brand information
export const brandInfo = {
  name: "Blue Scorpion",
  tagline: "Revolutionary Pain & Inflammation Relief",
  description:
    "Transform your life with scientifically proven anti-inflammatory technology that delivers fast, lasting pain relief in just hours.",
  founded: "2020",
  email: "hello@bluescorpion.com",
  phone: "+1 (555) 123-4567",
  address: "123 Wellness Drive, Los Angeles, CA 90210",
};

// Social media links
export const socialLinks = {
  instagram: "https://instagram.com/bluescorpion",
  facebook: "https://facebook.com/bluescorpion",
  twitter: "https://twitter.com/bluescorpion",
  youtube: "https://youtube.com/bluescorpion",
  tiktok: "https://tiktok.com/@bluescorpion",
};
