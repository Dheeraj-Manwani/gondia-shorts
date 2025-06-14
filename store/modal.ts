import { create } from "zustand";

export type ModalStore = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
};

export const useModal = create<ModalStore>()((set) => ({
  isOpen: false,
  setIsOpen: (val: boolean) => set({ isOpen: val }),
}));
