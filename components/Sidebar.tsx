"use client";

import React, { useEffect, useState } from "react";
import {
  BookmarkCheck,
  Download,
  Film,
  Heart,
  LogOut,
  Plus,
} from "lucide-react";
// import Image from "next/image";
// import googleIcon from "@/public/google-icon.svg";
import { signOut, useSession } from "next-auth/react";
// import { Button } from "./ui/button";
import { UserProfile } from "./UserProfile";
import { appSession } from "@/lib/auth";
import { useRouter } from "nextjs-toploader/app";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategoryId: number;
  onSelectCategory: (categoryId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  // selectedCategoryId,
  // onSelectCategory,
}) => {
  // const { data: categories } = useQuery<Category[]>({
  //   queryKey: ['/api/categories'],
  //   enabled: true,
  // });
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const session = useSession() as unknown as appSession;
  const router = useRouter();

  // Handle PWA installation
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if app is already installed
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isFullscreen = window.matchMedia(
      "(display-mode: fullscreen)"
    ).matches;
    const isIOSStandalone =
      "standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    if (isStandalone || isFullscreen || isIOSStandalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const promptInstall = async () => {
    if (!installPrompt) return;

    // Show the install prompt
    await installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the PWA installation");
      setIsInstalled(true);
    }

    // Clear the saved prompt since it can't be used twice
    setInstallPrompt(null);
  };

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // const handleCategorySelect = (categoryId: number) => {
  //   onSelectCategory(categoryId);
  //   onClose();
  // };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-5 py-5 border-b border-gray-200 flex justify-between items-center">
            {/* <h2 className="text-black text-xl font-semibold">
              Gondia<span className="text-blue-600">Shorts</span>
            </h2> */}
            <UserProfile />
            <button
              onClick={onClose}
              className="text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User info */}
          {/* <div className="p-5 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 uppercase mb-3">
              Categories
            </h3>
            <ul className="space-y-1">
              <li>
                <Button
                  variant="outline"
                  className="relative"
                  // onClick={(e) => {
                  //   e.preventDefault;
                  //   signIn("google")
                  // }}
                  onClick={(e) => signIn("google")}
                >
                  Sign In
                  <Image
                    priority
                    src={googleIcon}
                    alt="Sign In"
                    // height={15}
                    // width={15}
                    className="pl-2 w-7 aspect-square"
                  />
                </Button>
              </li>
            </ul>
          </div> */}

          {/* Categories */}
          {/* <div className="p-5 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 uppercase mb-3">
              Categories
            </h3>
            <ul className="space-y-1">
          {categories?.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategorySelect(category.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                      selectedCategoryId === category.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Other options */}

          {/* <li>
                <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                  Search
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
                    />
                  </svg>
                  Language
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  </svg>
                  Dark Mode
                </button>
              </li> */}
          <div className="p-5">
            <h3 className="text-sm font-medium text-gray-700 uppercase mb-3">
              Options
            </h3>
            <ul className="space-y-1 text-gray-600">
              <li>
                <button
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    router.push("/");
                  }}
                >
                  <Film />
                  Feed
                </button>
              </li>
              {session.status == "authenticated" && (
                <>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        router.push("/personal/saved");
                      }}
                    >
                      <BookmarkCheck />
                      Saved Articles
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        router.push("/personal/liked");
                      }}
                    >
                      <Heart />
                      Liked Articles
                    </button>
                  </li>
                  {(session.data.user?.role === "ADMIN" ||
                    session.data.user?.role === "PUBLISHER") && (
                    <li>
                      <button
                        className="w-full text-left px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          onClose();
                          router.push("/new");
                        }}
                      >
                        <Plus />
                        New Article
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      className="w-full text-left px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 cursor-pointer"
                      onClick={() => signOut()}
                    >
                      <LogOut />
                      Log out
                    </button>
                  </li>
                </>
              )}

              {/* Install App button - only shows if installable and not already installed */}
              {installPrompt && !isInstalled && (
                <li>
                  <button
                    onClick={promptInstall}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors flex items-center gap-3 text-blue-600 font-medium"
                  >
                    <Download className="w-5 h-5" />
                    Install App
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Version info */}
          <div className="mt-auto p-5 text-xs text-gray-500">
            GondiaShorts v1.0.0
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
