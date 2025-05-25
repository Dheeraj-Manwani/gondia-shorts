import { appSession } from "@/lib/auth";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";

export const useAuthGuard = () => {
  const session = useSession() as unknown as appSession;

  const guard = (callback: () => void) => {
    return () => {
      if (!session || !session.data || !session.data.user?.id) {
        toast.error("Please login to continue.");
        // signIn();
        return;
      }
      callback();
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
