import Image from "next/image";
import Navbar from "@/components/Navbar";
import InstagramLinks from "@/components/InstagramLinks";
import TextMessageTestimonials from "@/components/TextMessageTestimonials";
import WallOfLove from "@/components/WallOfLove";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import PressNews from "@/components/PressNews";
import Footer from "@/components/Footer";
import { VideoProvider } from "@/contexts/VideoContext";
export default function Home() {
  return (
    <VideoProvider>
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
                  Instagram | Wall of Love
                </h1>
                <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
                  See What Our Customers Say About Us
                </p>
                <p className="text-base lg:text-lg text-white/80 mt-2">
                  Real results from real people…
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Components */}
        <InstagramLinks />
        <TextMessageTestimonials />
        <WallOfLove />
        <BeforeAfterGallery />
        <PressNews />


        {/* Footer */}
        <Footer />
      </main>
    </VideoProvider>
  );
}
