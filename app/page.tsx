"use client";

// import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import NewsCarousel from "@/components/NewsCarousel";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
// import TestimonialsSection from "@/components/TestimonialsSection";
// import DownloadCTA from "@/components/DownloadCTA";
import Footer from "@/components/Footer";

export default function Home() {
  // Implement smooth scrolling
  // useEffect(() => {
  //   document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  //     anchor.addEventListener("click", function (e) {
  //       e.preventDefault();
  //       const target = document.querySelector(
  //         this.getAttribute("href") as string
  //       );
  //       if (target) {
  //         target.scrollIntoView({
  //           behavior: "smooth",
  //         });
  //       }
  //     });
  //   });
  // }, []);

  return (
    <div className="font-inter text-gray-800 bg-gray-50">
      {/* <Navbar /> */}
      <HeroSection />
      <NewsCarousel />
      <FeaturesSection />
      <HowItWorks />
      {/* <TestimonialsSection /> */}
      {/* <DownloadCTA /> */}
      <Footer />
    </div>
  );
}
