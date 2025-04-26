"use client";

import { ReactNode, FC, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

type AppWrapperProps = {
  children: ReactNode;
};

export const AppWrapper: FC<AppWrapperProps> = ({ children }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1); // Default to "All" category
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 font-roboto overflow-hidden">
        <Header onMenuClick={handleMenuClick} />
        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
        <Toaster
          richColors
          closeButton
          mobileOffset={20}
          position="bottom-center"
        />
        {children}
      </div>
    </SessionProvider>
  );
};
