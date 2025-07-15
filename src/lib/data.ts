// Sample data for Blue Scorpion landing page

export interface InstagramPost {
  id: string;
  image: string;
  url: string;
  alt: string;
}


export interface BeforeAfterPair {
  id: string;
  before: string;
  after: string;
  caption: string;
  beforeAlt: string;
  afterAlt: string;
}


// Instagram Posts
export const instagramPosts: InstagramPost[] = [
  {
    id: "1",
    image: "https://dgklukamfrrig5hi.public.blob.vercel-storage.com/testimonial%20videos/cuttino-story-JSmbCvvyIyYb1EbudQ6X5yyfFznhdR.mp4",
    url: "https://dgklukamfrrig5hi.public.blob.vercel-storage.com/testimonial%20videos/cuttino-story-JSmbCvvyIyYb1EbudQ6X5yyfFznhdR.mp4",
    alt: "Cuttino's Blue Scorpion pain relief testimonial video",
  },
  {
    id: "2",
    image: "https://dgklukamfrrig5hi.public.blob.vercel-storage.com/testimonial%20videos/isaiah-story-tYnbQYuSq5vxK43FwXEvYBpkSeykon.mp4",
    url: "https://dgklukamfrrig5hi.public.blob.vercel-storage.com/testimonial%20videos/isaiah-story-tYnbQYuSq5vxK43FwXEvYBpkSeykon.mp4",
    alt: "Isaiah's Blue Scorpion pain relief testimonial video",
  },
  {
    id: "3",
    image: "https://dgklukamfrrig5hi.public.blob.vercel-storage.com/testimonial%20videos/lyneve-story-hA0mdhrCufvMIqoA4yPus8AiYggjdn.mp4",
    url: "https://dgklukamfrrig5hi.public.blob.vercel-storage.com/testimonial%20videos/lyneve-story-hA0mdhrCufvMIqoA4yPus8AiYggjdn.mp4",
    alt: "Lyneve's Blue Scorpion pain relief testimonial video",
  },
  {
    id: "4",
    image: "https://dgklukamfrrig5hi.public.blob.vercel-storage.com/testimonial%20videos/bio-hack-story-wCVl1sxj3vxeeD2FZl1OOey2ARBDrY.mp4",
    url: "https://dgklukamfrrig5hi.public.blob.vercel-storage.com/testimonial%20videos/bio-hack-story-wCVl1sxj3vxeeD2FZl1OOey2ARBDrY.mp4",
    alt: "Bio Hack's Blue Scorpion pain relief testimonial video",
  },
  {
    id: "5",
    image: "https://dgklukamfrrig5hi.public.blob.vercel-storage.com/testimonial%20videos/frankmir-story-QBbKFDxgVY7hzO6IRL3i6Jxl3aNR1t.mp4",
    url: "https://dgklukamfrrig5hi.public.blob.vercel-storage.com/testimonial%20videos/frankmir-story-QBbKFDxgVY7hzO6IRL3i6Jxl3aNR1t.mp4",
    alt: "Frankmir's Blue Scorpion pain relief testimonial video",
  },
  {
    id: "6",
    image: "https://dgklukamfrrig5hi.public.blob.vercel-storage.com/testimonial%20videos/brendan-story-oIvJCeENmbxoZobbZKxjFrmF6uLyvs.mp4",
    url: "https://dgklukamfrrig5hi.public.blob.vercel-storage.com/testimonial%20videos/brendan-story-oIvJCeENmbxoZobbZKxjFrmF6uLyvs.mp4",
    alt: "Brendan's Blue Scorpion pain relief testimonial video",
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

