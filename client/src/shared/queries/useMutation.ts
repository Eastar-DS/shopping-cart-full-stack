import { useState } from "react";

interface UseMutationOptions<TData, TVariables> {
  mutateFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: unknown, variables: TVariables) => void;
}

export function useMutation<TData, TVariables = void>({
  mutateFn,
  onSuccess,
  onError,
}: UseMutationOptions<TData, TVariables>) {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (variables: TVariables): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await mutateFn(variables);
      onSuccess?.(data, variables);
    } catch (error) {
      onError?.(error, variables);
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
}
