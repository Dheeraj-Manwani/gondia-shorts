"use client";

import { motion } from "framer-motion";
import { Download, Hand, Bookmark } from "lucide-react";

const steps = [
  {
    icon: <Download className="text-primary text-2xl" />,
    title: "Download the App",
    description:
      "Get Gondia Shorts from your app store and create a profile in seconds to get started.",
  },
  {
    icon: <Hand className="text-secondary text-2xl" />,
    title: "Swipe Through News",
    description:
      "Browse through bite-sized news articles with simple swipe gestures - up for the next story.",
  },
  {
    icon: <Bookmark className="text-accent text-2xl" />,
    title: "Save & Share",
    description:
      "Bookmark articles to read later or share important news with your network instantly.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold font-montserrat text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-5 relative"
                style={{
                  backgroundColor:
                    index === 0
                      ? "rgba(255, 87, 51, 0.1)"
                      : index === 1
                      ? "rgba(58, 134, 255, 0.1)"
                      : "rgba(255, 209, 102, 0.1)",
                }}
              >
                <div
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                  style={{
                    backgroundColor:
                      index === 0
                        ? "var(--primary)"
                        : index === 1
                        ? "var(--secondary)"
                        : "var(--accent)",
                    color: index === 2 ? "#1F2937" : "white",
                  }}
                >
                  {index + 1}
                </div>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a
            href="#"
            className="inline-block bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={(e) => e.preventDefault()}
          >
            <svg
              className="w-5 h-5 inline-block mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.523 15.3414c-.5511.2968-1.1608.6038-1.8317.6289-3.0266.1111-5.6629-2.7214-5.6629-5.7127 0-1.4921.568-2.8555 1.4915-3.8935.5708-.6387 1.3061-1.1637 2.1516-1.4834-2.5893-.4312-4.8565 1.144-5.9307 3.2869-1.4667 2.9257-.9955 6.8783 1.356 9.2938 1.1299 1.1788 2.5472 1.6465 3.9967 1.6465 1.6834 0 3.3668-.6765 4.6307-1.9395 1.4419-1.4306 1.9797-3.4367 1.4419-5.6294-.5344.338-1.0782.6641-1.6431.9114zm-9.0389-2.5503c.6479-1.1423 1.9126-1.8903 3.3171-1.8903 2.1046 0 3.8332 1.7287 3.8332 3.8333 0 2.1046-1.7286 3.8333-3.8332 3.8333-2.1046 0-3.8332-1.7287-3.8332-3.8333 0-.6479.1617-1.2957.4855-1.8793.0967-.1721.0967-.3582.0131-.5303-.2827-.4735-.8485-.5581-1.2224-.1979-.3055.2968-.5511.6226-.7463.948-.3582.5963-.5581 1.274-.5581 1.9595 0 2.9527 2.4124 5.3651 5.3651 5.3651 2.9526 0 5.365-2.4124 5.365-5.3651 0-2.9526-2.4124-5.365-5.365-5.365-1.8794 0-3.582.9848-4.5537 2.5714-.2827.4599-.1192 1.0513.3407 1.334.4599.2827 1.0513.1191 1.334-.3408z" />
            </svg>
            Download the App
          </a>
        </motion.div>
      </div>
    </section>
  );
}
