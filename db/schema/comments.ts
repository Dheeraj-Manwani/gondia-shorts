export type Comment = {
  id: number;
  username: string;
  timeAgo: string; // e.g. "2 hours ago", "just now"
  text: string;
  likes: number;
  dislikes: number;
  liked: boolean;
  disliked: boolean;
};

export type SortOption = "top" | "newest" | "oldest";
