"use client";
import { motion } from "motion/react";

export const Logo = () => {
  return (
    <motion.span
      initial={{ backgroundColor: "white", opacity: 1 }}
      animate={{ backgroundColor: "rgba(30, 41, 57, 0.4)" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
      className="text-xl font-bold  tracking-tighter flex gap-[1px] bg-gray-800/40 py-1 px-2 rounded-lg cursor-pointer"
    >
      {/* Animate G */}
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: 1, scale: 1.2 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-black"
      >
        G
      </motion.span>

      {/* Animate rest of 'ondia' (fade out if you want) */}
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, scale: 0, width: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        ondia
      </motion.span>

      {/* Animate S */}
      <motion.span
        // initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: 1.2, translateX: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-blue-600"
      >
        S
      </motion.span>

      {/* Animate 'horts' (optional fade-in) */}
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, scale: 0, width: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        horts
      </motion.span>
    </motion.span>
  );
};
