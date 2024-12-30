import { useEffect, useState } from "react";

export enum FetchStatus {
  IDLE,
  LOADING,
  SUCCESS,
  FAILURE,
  CANCELED,
}

export interface UseFetchState<R> {
  response?: R;
  error?: Error;
  status: FetchStatus;
}

export function useFetch<Res>(
  url: RequestInfo,
  options?: RequestInit
): UseFetchState<Res> {
  const [response, setResponse] = useState<Res>();
  const [error, setError] = useState<Error>();
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const doFetch = async (): Promise<void> => {
      setStatus(FetchStatus.LOADING);
      try {
        const res = await fetch(url, options);

        if (!res.ok) throw new Error(res.statusText);
        if (signal.aborted) return setStatus(FetchStatus.CANCELED);

        const json: Res = await res.json();
        setResponse(json);
        setStatus(FetchStatus.SUCCESS);
      } catch (error: unknown) {
        if (signal.aborted) return setStatus(FetchStatus.CANCELED);

        setError(error as Error);
        setStatus(FetchStatus.FAILURE);
      }
    };
    doFetch();

    return () => {
      abortController.abort();
    };
  }, []);

  return { response, error, status };
}

export default useFetch;
