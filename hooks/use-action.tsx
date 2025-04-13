// You can use this hook to execute an action and handle its state in a client component.

import { useState, useCallback } from "react";

// import { ActionState, FieldErrors } from "@/lib/create-safe-action";
import { toast } from "sonner";
import { z } from "zod";

type Action<TInput, TOutput> = (data: TInput) => Promise<any>;

interface UseActionOptions<TInput, TOutput> {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
  toastMessages?: { loading?: string; success?: string; error?: string };
  schema?: z.Schema<TInput>;
}

export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options: UseActionOptions<TInput, TOutput> = {}
) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<TOutput[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let toastId: string | number | undefined;

  const execute = useCallback(
    async (input: TInput) => {
      if (options.schema) {
        const validationResult = options.schema.safeParse(input);
        if (!validationResult.success) {
          return { success: false };
        }
      }

      setIsLoading(true);
      if (options.toastMessages?.loading) {
        toastId = toast.loading(options.toastMessages.loading);
      }
      try {
        const result = await action(input);

        if (!result) {
          return { success: false };
        }

        if (result.error) {
          if (toastId)
            toast.error(options.toastMessages?.error, { id: toastId });
          setError(result.error);
          options.onError?.(result.error);
          return { success: false };
        }

        if (result.data) {
          setData(result.data);
          options.onSuccess?.(result.data);
        }

        if (toastId)
          toast.success(options.toastMessages?.success, { id: toastId });
        return { success: true, routeParam: result.routeParam };
      } finally {
        setIsLoading(false);
        options.onComplete?.();
      }
    },
    [action, options]
  );

  return {
    execute,
    error,
    data,
    isLoading,
    setData,
  };
};
