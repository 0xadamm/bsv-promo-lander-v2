import Navbar from "@/components/Navbar";
import InstagramLinks from "@/components/InstagramLinks";
import WallOfLove from "@/components/WallOfLove";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import StarReviews from "@/components/StarReviews";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 lg:pt-24 pb-16 lg:pb-24 bg-gradient-to-b from-brand-light to-white">
        <div className="container-wide">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-brand-primary mb-6">
              End Your Pain with{" "}
              <span className="gradient-text">Blue Scorpion</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Revolutionary pain & inflammation relief with scientifically
              proven anti-inflammatory technology. Feel relief in just hours and
              join thousands of pain-free customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-brand-primary text-white px-8 py-4 rounded-lg hover:bg-brand-accent transition-all duration-300 transform hover:scale-105 text-lg font-semibold">
                Get Relief Now - $89.99
              </button>
              <button className="border-2 border-brand-primary text-brand-primary px-8 py-4 rounded-lg hover:bg-brand-primary hover:text-white transition-all duration-300 text-lg font-semibold">
                Watch Stories
              </button>
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
