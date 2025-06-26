"use client";

import { appSession } from "@/lib/auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Logo } from "./Logo";
import { motion } from "motion/react";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const session = useSession() as unknown as appSession;
  return (
    <div className="fixed top-0 left-0 right-0 z-20 bg-transparent ">
      <div className="px-3 py-1.5 flex justify-between items-center">
        <div>
          <Link className="flex items-center justify-start" href="/">
            {/* <span className="text-black text-xl font-bold tracking-tight cursor-pointer">
              Gondia<span className="text-blue-600">Shorts</span>
            </span> */}
            <Logo />
            {session.data?.user && session.data.user.role !== "USER" && (
              // <Badge
              //   className="text-[10px] font-medium relative bottom-3 py-0 px-0.5"
              //   variant={"default"}
              // >
              //   {session.data.user.role}
              // </Badge>
              <span className="bg-yellow-100 text-yellow-800 text-[10px] font-semibold me-2 px-1.5 py-[1px] rounded-sm border border-yellow-300 relative bottom-3 left-1">
                {session.data.user.role}
              </span>
            )}
          </Link>
        </div>

        <motion.button
          className="py-1 px-1 rounded-lg cursor-pointer bg-gray-800/40"
          aria-label="Menu"
          onClick={onMenuClick}
          // animate={{ padding: "1.5px", borderRadius: "5px" }}
          // transition={{ delay: 0.5, duration: 0.5 }}/
        >
          <Menu className="text-blue-600 " />
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg> */}
        </motion.button>
      </div>
    </div>
  );
};

export default Header;
