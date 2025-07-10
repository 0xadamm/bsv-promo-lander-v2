import Image from "next/image";
import Navbar from "@/components/Navbar";
import InstagramLinks from "@/components/InstagramLinks";
import WallOfLove from "@/components/WallOfLove";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import StarReviews from "@/components/StarReviews";
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section - Floating Screen */}
      <section className="relative min-h-screen w-full flex items-center justify-center p-[10px]">
        <div className="relative w-full h-[calc(100vh-20px)] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/blue-scorpion-venom-hero.png"
            alt="Blue Scorpion Pain Relief Hero"
            fill
            priority
            className="object-cover object-center"
          />

          {/* Color tint overlay */}
          <div className="absolute inset-0 bg-[#324785]/70" />

          {/* Hero Text */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center px-6 lg:px-12">
              <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">
                See What Our Customers Say About Us
              </h1>
              <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
                Real results from real people who trust Blue Scorpion for their
                pain relief needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Components */}
      <InstagramLinks />
      <WallOfLove />
      <BeforeAfterGallery />
      <StarReviews />

      {/* Temporary placeholder for remaining sections */}
      <section className="py-16 bg-gray-50 text-center">
        <div className="container-wide">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            More sections coming soon...
          </h2>
          <p className="text-gray-500">
            5-Star Reviews • Press Features • News Articles • Footer
          </p>
        </div>
      </section>
    </main>
  );
}
