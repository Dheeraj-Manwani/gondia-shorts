"use client";

import { motion } from "framer-motion";
import {
  SwatchBook,
  Newspaper,
  Zap,
  Languages,
  Bell,
  Share2,
} from "lucide-react";

const features = [
  {
    icon: <SwatchBook className="text-primary text-2xl" />,
    title: "Swipeable Stories",
    description:
      "Navigate through local news with a simple swipe gesture. Move through stories effortlessly, similar to how you use social media stories.",
  },
  {
    icon: <Newspaper className="text-secondary text-2xl" />,
    title: "Curated Local Content",
    description:
      "Access news that matters to you - all stories are carefully selected and focused exclusively on Gondia district events and developments.",
  },
  {
    icon: <Zap className="text-accent text-2xl" />,
    title: "Fast Loading",
    description:
      "Optimized for even slow connections, our app ensures you get your news updates quickly without frustrating load times.",
  },
  {
    icon: <Languages className="text-primary text-2xl" />,
    title: "Multilingual Support",
    description:
      "Read news in your preferred language with support for English, Hindi, and Marathi to serve all of Gondia's diverse communities.",
  },
  {
    icon: <Bell className="text-secondary text-2xl" />,
    title: "Breaking News Alerts",
    description:
      "Stay informed with instant notifications for important developments and breaking news from around your district.",
  },
  {
    icon: <Share2 className="text-accent text-2xl" />,
    title: "Easy Sharing",
    description:
      "Share important news with friends and family with a single tap, spreading awareness about local issues and developments.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold font-montserrat text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Why Choose Gondia Shorts?
        </motion.h2>

        <motion.p
          className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We make it easy to stay connected with your community through a
          modern, intuitive news experience designed specifically for
          Gondia&apos;s residents.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                style={{
                  backgroundColor:
                    index % 3 === 0
                      ? "rgba(255, 87, 51, 0.1)"
                      : index % 3 === 1
                      ? "rgba(58, 134, 255, 0.1)"
                      : "rgba(255, 209, 102, 0.1)",
                }}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
