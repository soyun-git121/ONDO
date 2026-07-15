import { useEffect, useState } from "react";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * 단건 조회 공통 훅. 백엔드 미기동·자료 없음이면 error를 세팅하고
 * 페이지는 빈칸 플레이스홀더(EmptyBlock)를 보여준다.
 */
export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []): State<T> {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let alive = true;
    setState({ data: null, loading: true, error: null });
    fetcher()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((e: Error) => alive && setState({ data: null, loading: false, error: e.message }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
