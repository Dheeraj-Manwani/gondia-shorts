// import React, { useEffect, useRef } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { Category } from '@shared/schema';

// interface CategoryNavProps {
//   selectedCategoryId: number;
//   onSelectCategory: (categoryId: number) => void;
// }

// const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategoryId, onSelectCategory }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const { data: categories, isLoading, error } = useQuery<Category[]>({
//     queryKey: ['/api/categories'],
//   });

//   // Horizontal scroll for category pills with mouse wheel
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     const handleWheel = (e: WheelEvent) => {
//       if (e.deltaY !== 0) {
//         e.preventDefault();
//         container.scrollLeft += e.deltaY;
//       }
//     };

//     container.addEventListener('wheel', handleWheel);
//     return () => {
//       container.removeEventListener('wheel', handleWheel);
//     };
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="bg-white sticky top-[53px] z-[9] shadow-sm">
//         <div className="overflow-x-auto whitespace-nowrap px-4 py-3">
//           {Array(5).fill(0).map((_, i) => (
//             <div key={i} className="inline-block h-6 w-20 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (error || !categories) {
//     return (
//       <div className="bg-white sticky top-[53px] z-[9] shadow-sm">
//         <div className="px-4 py-3 text-sm text-red-500">
//           Failed to load categories
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white sticky top-[53px] z-[9] shadow-sm">
//       <div ref={containerRef} className="overflow-x-auto whitespace-nowrap px-4 py-3">
//         {categories.map((category) => (
//           <button
//             key={category.id}
//             className={`text-xs font-medium py-1 px-3 mr-2 rounded-full ${
//               selectedCategoryId === category.id
//                 ? 'bg-blue-600 text-white'
//                 : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//             }`}
//             onClick={() => onSelectCategory(category.id)}
//           >
//             {category.name}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CategoryNav;
