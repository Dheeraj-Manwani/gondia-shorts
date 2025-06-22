"use client";

import { useRouter } from "next/navigation";

// import HeroSection from "@/components/HeroSection";
// import NewsCarousel from "@/components/NewsCarousel";
// import FeaturesSection from "@/components/FeaturesSection";
// import HowItWorks from "@/components/HowItWorks";
// import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  router.push("/");
  return <></>;
  //   return (
  //     <div className="font-inter text-gray-800 bg-gray-50">
  //       {/* <Navbar /> */}
  //       <HeroSection />
  //       <NewsCarousel />
  //       <FeaturesSection />
  //       <HowItWorks />
  //       {/* <TestimonialsSection /> */}
  //       {/* <DownloadCTA /> */}
  //       <Footer />
  //     </div>
  //   );
}
