import { ArticleType } from "@prisma/client/index.js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isAttachmentRequired = (selectedType: ArticleType) =>
  selectedType === ArticleType.IMAGE_N_TEXT ||
  selectedType === ArticleType.VIDEO_N_TEXT ||
  selectedType === ArticleType.FULL_IMAGE ||
  selectedType === ArticleType.FULL_VIDEO;

export const areFileMapsEqual = (
  map1: Map<string, File>,
  map2: Map<string, File>
) => {
  if (map1.size !== map2.size) return false;

  for (const [key, file1] of map1) {
    const file2 = map2.get(key);
    if (!file2) return false;

    if (
      file1.name !== file2.name ||
      file1.size !== file2.size ||
      file1.type !== file2.type ||
      file1.lastModified !== file2.lastModified
    ) {
      return false;
    }
  }

  return true;
};

export const checkValidImageExtension = (str: string) => {
  const STR = str.toUpperCase();
  return STR === "PNG" || STR === "JPG" || STR === "GIF" || STR === "JPEG";
};

export const getTimeDifference = (timestamp: Date | undefined): string => {
  if (!timestamp) return "";
  const now = new Date();
  const givenDate = new Date(timestamp);
  const diffInSeconds = Math.floor(
    (now.getTime() - givenDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4)
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12)
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};
