import { isNumber } from 'lodash';
import type { FunctionComponent, PropsWithChildren } from 'react';
import { useMemo } from 'react';
import classNames from 'classnames';
import { px2vw } from '@/service/browser';
import styles from './styles.module.less';

/** 内边距 */
export const Padding: FunctionComponent<
  PropsWithChildren<{
    className?: string;
    size?: number | string | 'default' | 'large';
  }>
> = ({ children, className, size = 'default' }) => {
  const p = useMemo(() => {
    if (isNumber(size)) {
      return px2vw(size);
    }
    if (size === 'default') {
      return px2vw(24);
    }
    if (size === 'large') {
      return px2vw(36);
    }
    return size;
  }, [size]);

  return (
    <div
      className={classNames(styles.paddingWrapper, className)}
      style={{
        marginLeft: p,
        marginRight: p,
      }}
    >
      {children}
    </div>
  );
};
