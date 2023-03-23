import type { FunctionComponent } from 'react';
import { useContext, useEffect, useCallback } from 'react';
import { useRequest } from 'ahooks';
import { PersonListInterface } from 'taoliujun-shy-jobs-interface/lib/h5/person';
import type { Person } from 'taoliujun-shy-jobs-interface/lib/model/person';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Scroll } from '@/components/Scroll';
import { getRoute, WebRouteNameEnum } from '@/service/webRoute';
import { useSetTitle } from '@/hooks/useSetTitle';
import { GlobalStoreContext } from '@/components/GlobalStore';
import styles from './styles.module.less';

const ItemsScroll: FunctionComponent<{
  datas?: Person[];
}> = ({ datas }) => {
  const { globalEnums } = useContext(GlobalStoreContext);

  const go = useNavigate();

  const onDetail = useCallback(
    (item: Person) => {
      go(
        getRoute({
          name: WebRouteNameEnum.PERSON_DETAIL,
          params: {
            id: String(item.id),
          },
        }),
      );
    },
    [go],
  );

  return (
    <>
      {datas?.map((v) => {
        return (
          <div
            key={v.id}
            className={styles.itemWrapper}
            onClick={() => {
              onDetail(v);
            }}
          >
            <h2 className={styles.title}>{v.title}</h2>
            <div className={styles.content}>
              报名时间：{dayjs(v.createTime).format('YYYY-MM-DD HH:mm')}
              <br />
              报名人：{v.truename}
              <br />
              身份证：{v.idcard}
              <br />
              手机号：{v.mobile}
              <br />
              状态：{globalEnums.personStatus?.[v.status]}
              {Boolean(v.fee) && (
                <>
                  <br />
                  支付状态：{globalEnums.personPayStatus?.[v.payStatus]}
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

/** 报名记录 */
export const List: FunctionComponent = () => {
  useSetTitle('报名记录');

  const { runAsync: dataRequest } = useRequest((nextId) => {
    return PersonListInterface({
      nextId,
      size: 10,
    });
  });

  const { data: reloadDep, runAsync: runReload } = useRequest(
    () => {
      return Promise.resolve(Math.random());
    },
    { manual: true },
  );

  useEffect(() => {
    runReload();
  }, [runReload]);

  return (
    <div className={styles.wrapper}>
      <Scroll isWindow dataRequest={dataRequest} reloadDep={reloadDep}>
        <ItemsScroll />
      </Scroll>
    </div>
  );
};
