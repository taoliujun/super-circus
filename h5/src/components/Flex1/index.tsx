import type { FunctionComponent, PropsWithChildren } from 'react';
import styles from './styles.module.less';

/** flex */
export const Flex1: FunctionComponent<PropsWithChildren<unknown>> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};
