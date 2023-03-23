import { ahookRequestCache } from '@taoliujun/utils';
import { useLocation } from 'react-router-dom';

/** request请求key的包装 */
const formatRequestCacheKey = (key: string) => {
  return `request/${key}`;
};

/** useRequestCacheKey */
export const useRequestCache = (
  key: string,
  /** 是否忽略路径 */
  ignorePath?: boolean,
) => {
  const q = useLocation();

  const cacheKey = formatRequestCacheKey(ignorePath ? key : `_path/${q.pathname}/${key}`);

  return ahookRequestCache(cacheKey);
};
