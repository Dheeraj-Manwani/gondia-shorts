"use client";

import React from "react";
// import Header from "@/components/Header";
// import Sidebar from "@/components/Sidebar";
import SwipeableNewsFeed from "@/components/SwipeableNewsFeed";

const Home: React.FC = () => {
  // const [selectedCategoryId, setSelectedCategoryId] = useState(1); // Default to "All" category
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // const handleMenuClick = () => {
  //   setSidebarOpen(true);
  // };

  // const handleCloseSidebar = () => {
  //   setSidebarOpen(false);
  // };

  return (
    // <div className="flex flex-col min-h-screen bg-gray-50 font-roboto overflow-hidden">
    //   <Header onMenuClick={handleMenuClick} />

    //   <Sidebar
    //     isOpen={sidebarOpen}
    //     onClose={handleCloseSidebar}
    //     selectedCategoryId={selectedCategoryId}
    //     onSelectCategory={setSelectedCategoryId}
    //   />

    // <SwipeableNewsFeed categoryId={selectedCategoryId} />
    // </div>
    <SwipeableNewsFeed categoryId={0} />
  );
};

export default Home;
