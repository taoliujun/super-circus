import type { FunctionComponent, PropsWithChildren } from 'react';
import { useMemo } from 'react';
import styles from './styles.module.less';

/** 居中且可自定义高度 */
export const Center: FunctionComponent<
  PropsWithChildren<{
    height?: string | 'full';
  }>
> = ({ height = 'full', children }) => {
  const h = useMemo(() => {
    return height === 'full' ? '100vh' : height;
  }, [height]);

  return (
    <div className={styles.wrapper} style={{ height: h }}>
      {children}
    </div>
  );
};
