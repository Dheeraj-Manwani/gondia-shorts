import { InteractionMap } from "@/db/schema/interaction";
import { create } from "zustand";

type InteractionStore = {
  interactions: InteractionMap[];
  setInteractions: (inter: InteractionMap[], isAppend?: boolean) => void;
};

export const useInteractions = create<InteractionStore>()((set, get) => ({
  interactions: [],
  setInteractions: (inter, isAppend = false) => {
    const currInt = isAppend ? get().interactions : [];
    set({ interactions: [...currInt, ...inter] });
  },
}));
