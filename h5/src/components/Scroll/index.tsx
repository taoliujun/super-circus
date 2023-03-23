import { useInfiniteScroll } from 'ahooks';
import type { Data } from 'ahooks/lib/useInfiniteScroll/types';
import classNames from 'classnames';
import { cloneDeep, without } from 'lodash';
import type { FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from 'react';
import React, { useEffect, useMemo, useRef } from 'react';
import styles from './styles.module.less';

type TData = Data & {
  nextId: unknown;
};

// 加载中
const Loading: FunctionComponent = () => {
  return <div className={styles.loadingWrapper}>加载中</div>;
};

interface ScrollProps {
  /** 数据请求方法 */
  dataRequest: (nextId: string) => Promise<TData>;
  /** 是否没有更多数据了 */
  noMoreData?: (input?: TData) => boolean;
  /** 空数据的节点 */
  emptyContent?: ReactNode | string;
  /** 首次加载之前的节点 */
  firstLoadingContent?: ReactElement;
  /** 是否显示全部加载完成的文案 */
  isShowComplete?: boolean;
  /** 全部加载完成的文案 */
  completeText?: string;
  /** 重置数据的依赖 */
  reloadDep?: number;
  /** 父元素是document? */
  isWindow?: boolean;
  /** 数据为空的回调 */
  onEmpty?: () => void;
}

export type OnScrollRemove = (idKey: string, id: string | number) => void;

// 滚动加载
export const Scroll: FunctionComponent<PropsWithChildren<ScrollProps>> = ({
  children,
  dataRequest,
  noMoreData = (input) => {
    return input !== undefined && !input?.nextId;
  },
  emptyContent = '暂无数据',
  firstLoadingContent = <Loading />,
  isShowComplete = true,
  completeText = '全部加载完成',
  reloadDep,
  isWindow = false,
  onEmpty,
}) => {
  const ref = useRef<HTMLDivElement>();

  const target = useMemo(() => {
    if (isWindow) {
      return document;
    }
    return ref;
  }, [isWindow]);

  const {
    data,
    /** 首次加载中 */
    loading: isFirstLoading,
    loadingMore,
    noMore,
    mutate,
  } = useInfiniteScroll(
    (d) => {
      return dataRequest(d?.nextId);
    },
    {
      target,
      isNoMore: (d) => {
        return noMoreData(d);
      },
      reloadDeps: [reloadDep],
    },
  );

  // 数据列表
  const list = useMemo(() => {
    return data?.list || [];
  }, [data?.list]);

  // 是否为空
  const isEmpty = useMemo(() => {
    return !isFirstLoading && noMore && list.length === 0;
  }, [isFirstLoading, list.length, noMore]);

  // 数据为空的情况回调
  useEffect(() => {
    if (isEmpty) {
      onEmpty?.();
    }
  }, [isEmpty, onEmpty]);

  return (
    <div
      ref={(e) => {
        ref.current = e as HTMLDivElement;
      }}
      className={classNames(styles.wrapper, isWindow ? null : styles.wrapperAbsolute)}
    >
      {isEmpty &&
        (typeof emptyContent === 'string' ? (
          <div className={styles.emptyWrapper}>{emptyContent}</div>
        ) : (
          emptyContent
        ))}

      {isFirstLoading ? (
        firstLoadingContent
      ) : (
        <div className={styles.itemsWrapper}>
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) {
              return null;
            }

            const childProps: {
              onScrollRemove: OnScrollRemove;
            } = {
              ...child.props,
              datas: list,
              onScrollRemove: (idKey, id) => {
                const prev = cloneDeep(data);
                const find = prev?.list?.find((v) => {
                  return v[idKey] === id;
                });

                if (find) {
                  (prev as NonNullable<typeof prev>).list = without(prev?.list, find);
                  mutate(prev);
                }
              },
            };

            return React.cloneElement(child, childProps);
          })}
        </div>
      )}

      {!noMore && loadingMore && <Loading />}

      {!isFirstLoading && noMore && list.length !== 0 && isShowComplete && (
        <div className={styles.completeWrapper}>{completeText}</div>
      )}
    </div>
  );
};
