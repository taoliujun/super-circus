import type { FunctionComponent } from 'react';
import { px2vw } from '@/service/browser';

/** 自定义高度 */
export const SpaceHeight: FunctionComponent<{
  height: number;
  color?: string;
}> = ({ height, color = 'transparent' }) => {
  return (
    <div
      style={{
        height: px2vw(height),
        backgroundColor: color,
      }}
    />
  );
};
