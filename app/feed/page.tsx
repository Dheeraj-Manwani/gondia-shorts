"use client";

import React from "react";
// import Header from "@/components/Header";
// import Sidebar from "@/components/Sidebar";
import { SwipeableNewsFeed } from "@/components/news-feeds/SwipeableNewsFeed";
import { useSearchParams } from "next/navigation";

const Home: React.FC = () => {
  // const [selectedCategoryId, setSelectedCategoryId] = useState(1); // Default to "All" category
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // const handleMenuClick = () => {
  //   setSidebarOpen(true);
  // };

  // const handleCloseSidebar = () => {
  //   setSidebarOpen(false);
  // };
  const searchParams = useSearchParams();
  const articleSlug = searchParams.get("article");

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
    <SwipeableNewsFeed
      categoryId={0}
      articleSlug={articleSlug}
      // session={session}
    />
  );
};

export default Home;
