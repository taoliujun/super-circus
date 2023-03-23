import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useQuery = <T = string>(key: string) => {
  const [q] = useSearchParams();

  const value = useMemo(() => {
    return q.get(key);
  }, [key, q]);

  return value as unknown as T;
};
