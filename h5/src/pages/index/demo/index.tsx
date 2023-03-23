import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { PersonPayInterface } from 'taoliujun-shy-jobs-interface/lib/h5/person';
import { Button } from 'antd-mobile';
import { useRequest } from 'ahooks';
import { useSetTitle } from '@/hooks/useSetTitle';
import { wechatConfig } from '@/service/wechat';
import { getApiUrl } from '@/service/request';

export const Demo: FunctionComponent = () => {
  useSetTitle('demo');

  useEffect(() => {
    wechatConfig(['chooseWXPay'], window.location.href.replace(window.location.hash, ''));
  }, []);

  const { runAsync: onPay, loading: payLoading } = useRequest(
    async () => {
      const res = await PersonPayInterface({
        id: 3,
        notify_url: `${window.location.origin}${getApiUrl('person/h5/wechatNotify')}`,
      });
      window.wx.chooseWXPay({
        ...res.payInfo,
        success: (ret: any) => {
          // 支付成功后的回调函数
          console.log('==支付成功===', ret);
        },
      });
    },
    { manual: true },
  );

  return (
    <div>
      <Button color="primary" loading={payLoading} onClick={onPay}>
        click demo
      </Button>
    </div>
  );
};
