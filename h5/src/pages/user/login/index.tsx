import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { useRequest } from 'ahooks';
import {
  WechatOffiAccountAuthUrlInterface,
  WechatOffiAccountLoginInterface,
} from 'taoliujun-shy-jobs-interface/lib/h5/user';
import { Button } from 'antd-mobile';
import { useSetTitle } from '@/hooks/useSetTitle';
import { useQuery } from '@/hooks/useQuery';
import { setCookieToken } from '@/service/token';
import { toastLoading, toastSuccess } from '@/service/toast';
import { getAbsoluteRoute, WebRouteNameEnum } from '@/service/webRoute';
import { isWechatApp, px2vw } from '@/service/browser';

export const Login: FunctionComponent = () => {
  useSetTitle('微信登录');

  const { runAsync: onGetWechatAuthUrl } = useRequest(
    () => {
      toastLoading('获取登录信息中');

      return WechatOffiAccountAuthUrlInterface({
        redirectUrl: window.location.href,
      }).then((res) => {
        window.location.href = res.url;
      });
    },
    {
      manual: true,
    },
  );

  const redirect = useQuery('redirect');

  const { runAsync: onWechatLogin } = useRequest(
    (code: string) => {
      toastLoading('登录中');

      return WechatOffiAccountLoginInterface({ code }).then((res) => {
        setCookieToken(res.token);
        toastSuccess('登录成功').then(() => {
          window.location.href = redirect || getAbsoluteRoute({ name: WebRouteNameEnum.HOME });
        });
      });
    },
    {
      manual: true,
    },
  );

  const code = useQuery('code');

  useEffect(() => {
    if (code) {
      onWechatLogin(code);
    }
  }, [code, onWechatLogin]);

  useEffect(() => {
    if (!code && isWechatApp()) {
      onGetWechatAuthUrl();
    }
  }, [code, onGetWechatAuthUrl]);

  if (code) {
    return null;
  }

  return (
    <div style={{ padding: px2vw(20) }}>
      <Button color="primary" block onClick={onGetWechatAuthUrl}>
        微信登录
      </Button>
    </div>
  );
};
