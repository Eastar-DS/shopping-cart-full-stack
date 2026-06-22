import { useRef, useState } from "react";

interface UseMutationOptions<TData, TVariables, TContext = unknown> {
  mutateFn: (variables: TVariables) => Promise<TData>;
  onMutate?: (variables: TVariables) => TContext;
  onSuccess?: (data: TData, variables: TVariables, context: TContext) => void;
  onError?: (error: unknown, variables: TVariables, context: TContext) => void;
}

export function useMutation<TData, TVariables = void, TContext = unknown>({
  mutateFn,
  onMutate,
  onSuccess,
  onError,
}: UseMutationOptions<TData, TVariables, TContext>) {
  const [isLoading, setIsLoading] = useState(false);
  const latestMutationIdRef = useRef(0);

  const mutate = async (variables: TVariables): Promise<void> => {
    const myId = ++latestMutationIdRef.current;
    let context: TContext | undefined;

    setIsLoading(true);

    try {
      context = onMutate?.(variables);
      const data = await mutateFn(variables);

      if (myId !== latestMutationIdRef.current) return;

      onSuccess?.(data, variables, context as TContext);
    } catch (error) {
      if (myId !== latestMutationIdRef.current) return;

      onError?.(error, variables, context as TContext);
    } finally {
      if (myId === latestMutationIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  return { mutate, isLoading };
}
