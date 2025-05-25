import { Article } from "@/db/schema/article";
import { create } from "zustand";

type ArticleStore = {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
};

export const useArticles = create<ArticleStore>((set) => ({
  articles: [],
  setArticles: (articles) => set({ articles }),
}));
