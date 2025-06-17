import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { useModal } from "@/store/modal";
import { SignIn } from "@/components/form/SignIn";

export const GenericModal = () => {
  const isOpen = useModal((state) => state.isOpen);
  const setIsOpen = useModal((state) => state.setIsOpen);
  //   const setIsOpen = useModal(stat)
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="bg-[#ffffff] text-gray-500 max-w-[95%] max-h-[90vh] p-0 rounded-md"
        onInteractOutside={(e) => {
          e.preventDefault();
          setIsOpen(false);
        }}
      >
        <SignIn onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
