import classNames from 'classnames';
import { omit } from 'lodash';
import type { CSSProperties, FunctionComponent, HTMLAttributes } from 'react';
import { useMemo } from 'react';
import { px2vw } from '@/service/browser';

// ali字体
export const FontIcon: FunctionComponent<
  HTMLAttributes<HTMLSpanElement> & {
    icon: string;
    size?: number;
    color?: 'primary' | string;
    disabled?: boolean;
    onClick?: () => void;
  }
> = (props) => {
  const { className, icon, size, color, disabled, onClick } = props;

  const styles = useMemo(() => {
    const ret: CSSProperties = {};
    if (size) {
      ret.fontSize = px2vw(size);
    }
    if (color) {
      let trueColor = color;
      if (color === 'primary') {
        trueColor = '#ee7002';
      }
      ret.color = trueColor;
    }
    return ret;
  }, [color, size]);

  return (
    <span
      {...omit(props, ['icon', 'size'])}
      className={classNames('alifont', `af-${icon}`, className)}
      style={styles}
      onClick={() => {
        if (disabled) {
          return;
        }
        onClick?.();
      }}
      aria-hidden
    />
  );
};
