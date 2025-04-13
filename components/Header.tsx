import Link from "next/link";
import React from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-black text-xl font-bold tracking-tight cursor-pointer">
              Gondia<span className="text-blue-600">Shorts</span>
            </span>
          </Link>
        </div>

        <button
          className="text-gray-700 p-2 rounded-full hover:bg-gray-100"
          aria-label="Menu"
          onClick={onMenuClick}
        >
          <svg
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
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
