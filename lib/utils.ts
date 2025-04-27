import { ArticleType } from "@prisma/client";
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
