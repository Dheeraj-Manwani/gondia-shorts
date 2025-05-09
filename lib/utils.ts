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
