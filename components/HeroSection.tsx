// "use client";

// // import { useLocation } from "wouter";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "nextjs-toploader/app";

// import { WordRotate } from "./WordRotate";
// import { ArrowRight } from "lucide-react";

// export default function HeroSection() {
//   //   const [, setLocation] = useLocation();

//   //   const handleCTAClick = () => {
//   //     setLocation("/feed");
//   //   };

//   const router = useRouter();

//   return (
//     <section className="relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white h-[90vh]">
//       {/* <div className="absolute inset-0 overflow-hidden z-0">
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6TTYwIDEyYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00ek0xMiAzNGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHptMC0yMmMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
//       </div> */}

//       <div className="container mx-auto px-4 relative z-10 flex flex-col justify-center h-[90vh]">
//         <div className="mx-auto text-center">
//           <motion.h1
//             className="text-4xl md:text-6xl font-bold font-montserrat mb-6 flex flex-col"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <span className="">
//               <span className="w-80">
//                 <WordRotate
//                   className="mb-3"
//                   words={[
//                     "Quick News",
//                     "Reliable News",
//                     "Authentic News",
//                     "Raw News",
//                   ]}
//                 ></WordRotate>
//               </span>
//               <span> from district Gondia</span>
//             </span>
//             {/* <span> one swipe at a time.</span> */}
//           </motion.h1>

//           <motion.p
//             className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.3 }}
//           >
//             Stay informed about Gondia with bite-sized local news that matters
//             to you.
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5, delay: 0.6 }}
//           >
//             <Button
//               onClick={() => router.push("/feed")}
//               className="text-gray-500 bg-white transition-all duration-300 font-bold py-3 px-8 rounded-full shadow-lg cursor-pointer"
//               size="lg"
//             >
//               Read News Articles <ArrowRight />
//             </Button>
//           </motion.div>
//         </div>
//       </div>

//       <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
//     </section>
//   );
// }
