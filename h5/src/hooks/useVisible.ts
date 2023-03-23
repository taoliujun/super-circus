import { useDocumentVisibility, useLatest } from 'ahooks';
import { useEffect } from 'react';

/** 页面可见 */
export const useVisible = (callback: (...args: any) => void) => {
  const res = useDocumentVisibility();

  const cb = useLatest(callback);

  useEffect(() => {
    if (res === 'visible') {
      cb.current();
    }
  }, [cb, res]);
};
