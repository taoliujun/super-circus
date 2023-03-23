import { Image } from 'antd-mobile';
import type { FunctionComponent, PropsWithChildren } from 'react';
import dayjs from 'dayjs';
import { fenToYuan } from '@taoliujun/utils';
import type { Apply } from 'taoliujun-shy-jobs-interface/lib/model/apply';
import { ApplyEndEnum } from 'taoliujun-shy-jobs-interface/lib/model/apply';
import { Loading } from '../Loading';
import styles from './styles.module.less';

/** 报名详情 */
export const ApplyDetail: FunctionComponent<
  PropsWithChildren<{
    data?: Partial<Apply>;
  }>
> = ({ data }) => {
  if (!data) {
    return <Loading />;
  }

  return (
    <div className={styles.wrapper}>
      <Image className={styles.posterWrapper} src={data?.poster} />
      <div className={styles.mainWrapper}>
        {Boolean(data?.title) && <p className={styles.titleWrapper}>{data?.title}</p>}
        <p className={styles.companyWrapper}>发布企业：{data?.relationUser?.name}</p>
        {Boolean(data?.desc) && <p className={styles.descWrapper}>{data?.desc}</p>}
        {Boolean(data?.content) && <p className={styles.contentWrapper}>{data?.content}</p>}

        <p className={styles.infoTitle}>报名信息</p>

        {data?.isEnd !== undefined && (
          <p className={styles.isEndWrapper}>
            是否已截止：
            {data?.isEnd === ApplyEndEnum.NO ? (
              '未截止'
            ) : (
              <span style={{ color: '#f00' }}>已截止</span>
            )}
          </p>
        )}
        {Boolean(data?.limitCount) && (
          <p className={styles.limitCountWrapper}>报名人数限制：{data?.limitCount}</p>
        )}
        {Boolean(data?.endTime) && (
          <p className={styles.endTimeWrapper}>
            报名截止时间：{dayjs(data?.endTime).format('YYYY-MM-DD HH:mm:ss')}
          </p>
        )}
        {Boolean(data?.applyFee) && (
          <p className={styles.feeWrapper}>报名费用：{fenToYuan(data?.applyFee)}元</p>
        )}
        {Boolean(data?.applyTime) && (
          <p className={styles.applyTimeWrapper}>
            报名时间：{dayjs(data?.applyTime).format('YYYY-MM-DD HH:mm:ss')}
          </p>
        )}
        {Boolean(data?.applyAddress) && (
          <p className={styles.applyAddressWrapper}>报名地点：{data?.applyAddress}</p>
        )}
        {Boolean(data?.applyContact) && (
          <p className={styles.applyContactWrapper}>报名联系：{data?.applyContact}</p>
        )}
      </div>
    </div>
  );
};
