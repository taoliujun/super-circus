import { useCallback, useState } from 'react';

/**
 * use state merge
 */
export const useDataMerge = <S, D>(initData: S) => {
  const [data, setData] = useState(initData);

  const dispatchData = useCallback((changeData: S) => {
    setData((prev) => {
      return {
        ...prev,
        ...changeData,
      };
    });
  }, []) as unknown as D;

  return [data, dispatchData] as const;
};
