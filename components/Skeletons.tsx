import { Skeleton } from "@/components/ui/skeleton";

export function NewsCardSkeleton() {
  return (
    <article className="news-card w-full h-full bg-white overflow-hidden relative flex flex-col">
      {/* Skeleton for Media */}
      <div className="h-[48vh]  w-full relative bg-gray-200 m-auto">
        <Skeleton className=" w-full h-[48vh]  bg-gray-400" />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div> */}

        {/* Source Info */}
        {/* <div className="absolute bottom-0 left-0 right-0 z-10 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-20 bg-gray-400" />
            <Skeleton className="h-4 w-4 rounded-full bg-gray-400" />
          </div>
          <Skeleton className="h-4 w-16 bg-gray-400" />
        </div> */}
      </div>

      {/* Social Actions */}
      <div className="px-4 py-3.5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-4 rounded-full bg-gray-400" />
            <Skeleton className="h-4 w-4 rounded-full bg-gray-400" />
            <Skeleton className="h-4 w-4 rounded-full bg-gray-400" />
          </div>
          <Skeleton className="h-4 w-4 rounded-full bg-gray-400" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-6 pb-6 flex flex-col space-y-5">
        {/* Headline */}
        <Skeleton className="h-6 w-full bg-gray-400" />
        {/* Summary */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full  bg-gray-400" />
          <Skeleton className="h-4 w-full bg-gray-400" />
          <Skeleton className="h-4 w-5/6 bg-gray-400" />
        </div>
      </div>
    </article>
  );
}
