import { appSession } from "@/lib/auth";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";

export const useAuthGuard = () => {
  const session = useSession() as unknown as appSession;

  const guard = (
    callback: (e?: React.MouseEvent<HTMLButtonElement>) => void
  ) => {
    return (e?: React.MouseEvent<HTMLButtonElement>) => {
      if (!session || !session.data || !session.data.user?.id) {
        toast.error("Please login to interact with a Post.");
        // signIn();
        return false;
      }
      callback(e);
    };
  };

  const guardAsync = (callback: () => Promise<void>) => {
    return async () => {
      if (!session || !session.data || !session.data.user?.id) {
        toast.error("Please login to continue.");
        signIn();
        return;
      }

      await callback();
    };
  };

  return { guard, guardAsync, session };
};
