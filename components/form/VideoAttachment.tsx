"use client";

import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { storeFileInS3 } from "@/actions/s3";
import { validateVideoFile } from "@/lib/utils";

export function VideoAttachment({
  label,
  videoUrl,
  setVideoUrl,
}: {
  label: string;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
}) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate video file
      const validation = validateVideoFile(file, 100);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }

      const toastId = toast.loading("Uploading video, please wait...");

      try {
        const url = await storeFileInS3(file);
        console.log("Uploaded video", file.name, "->", url);

        if (!url) {
          toast.error("Video upload failed!", { id: toastId });
          return;
        }

        const result = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${url}`;
        setVideoUrl(result);
        toast.success("Video uploaded successfully!", { id: toastId });
      } catch (error) {
        console.error("Error uploading video:", error);
        toast.error("Failed to upload video. Please try again.", {
          id: toastId,
        });
      }
    }
  };

  const handleRemoveVideo = () => {
    setVideoUrl("");
  };

  return (
    <div className="">
      <label
        htmlFor="video-upload"
        className="block mb-1 text-sm font-medium text-black"
      >
        {label}
      </label>
      <div className="flex gap-5 flex-row">
        <div className="flex gap-2 flex-row flex-wrap">
          {videoUrl ? (
            <div className="relative">
              <button
                className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                onClick={handleRemoveVideo}
              >
                <X className="size-4" />
              </button>
              <div className="relative w-48 h-32 bg-gray-200 rounded-lg overflow-hidden">
                {/* <video
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video> */}
                <video
                  src={videoUrl}
                  controls
                  //   autoPlay
                  className="w-full h-full object-cover"
                />
                {/* <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                  <Play className="size-8 text-white" />
                </div> */}
              </div>
            </div>
          ) : (
            <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-gray-400 transition-colors">
              <label
                htmlFor="video-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Plus className="size-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Upload Video</span>
                <span className="text-xs text-gray-400 mt-1">
                  MP4, MOV, AVI, etc.
                </span>
              </label>
              <input
                id="video-upload"
                className="hidden"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
