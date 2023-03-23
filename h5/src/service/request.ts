import type { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import axios from 'axios';
import { cloneDeep, trim } from 'lodash';
import { captureReactException, SentryReact } from '@/service/sentryReact';
import { toastFail } from '@/service/toast';
import { getRejectError } from 'taoliujun-shy-jobs-interface/lib/request';
import { pageConfig } from '../pageConfig';
import { appConfig } from '../appConfig';
import { getCookieToken, setCookieToken } from './token';
import { WebRouteNameEnum } from './webRoute';

const contentTypeKey = 'Content-Type';

const SSRAxios = axios.create({
  timeout: 100000,
  headers: {
    [contentTypeKey]: 'application/json; charset=UTF-8',
  },
  responseType: 'json',
});

SSRAxios.interceptors.response.use(
  (response) => {
    // 正常
    const { data: res } = response;

    if (res?.status !== 200) {
      toastFail(getRejectError(res));

      const extras = {
        statusCode: response?.status,
        url: response?.config?.url,
        method: response?.config?.method,
        postData: response?.config?.data,
        apiResponse: res,
      };

      SentryReact.withScope((scope) => {
        scope.setExtras(extras);
        captureReactException(new Error(res?.message || '接口请求失败'), 'api', 'info');
      });

      return Promise.reject(res);
    }

    if (response.headers.token) {
      setCookieToken(response.headers.token);
    }

    return response;
  },
  (err) => {
    const { response, message } = err;
    // 异常
    const res = response as AxiosResponse;

    let errMsg = getRejectError(res?.data) || message;

    if (res?.status === 401) {
      errMsg = '请先登录';
    }

    toastFail(errMsg);

    // 未登录
    if (res?.status === 401 && !response?.config?.headers?.ignoreAuth) {
      window.setTimeout(() => {
        let loginUrl = '';

        const pre =
          pageConfig.distPath === '/' || pageConfig.distPath === ''
            ? ''
            : `/${trim(pageConfig.distPath, '/')}`;

        if (appConfig.routeType === 'hash') {
          loginUrl = `${pre}/#${WebRouteNameEnum.USER_LOGIN}`;
        } else {
          loginUrl = `${pre}${WebRouteNameEnum.USER_LOGIN}`;
        }

        // 跳转登录
        window.location.href = `${loginUrl}?redirect=${encodeURIComponent(window.location.href)}`;
      }, 3000);

      return Promise.reject(res);
    }

    const extras = {
      statusCode: res?.status,
      url: res?.config?.url,
      method: res?.config?.method,
      postData: res?.config?.data,
      apiResponse: res?.data,
    };

    SentryReact.withScope((scope) => {
      scope.setExtras(extras);
      captureReactException(err, 'api', 'info');
    });

    return Promise.reject(res?.data || { message });
  },
);

const baseRequest = async (inputConfig: AxiosRequestConfig): Promise<AxiosResponse> => {
  const config = cloneDeep(inputConfig);

  config.headers = (config.headers || {}) as AxiosRequestHeaders;

  const cookieToken = getCookieToken();

  if (cookieToken) {
    config.headers.token = cookieToken;
    SentryReact.setExtras({
      cookieToken,
    });
  }

  const res = await SSRAxios.request(config);

  return res;
};

/** 获取接口地址 */
export const getApiUrl = (input: string): string => {
  return `/api/${input}`;
};

/** 发起接口请求，并返回res.data */
export const requestApi = async <T>(
  url: string,
  request: unknown,
  opts?: {
    headers?: Record<string, string | number | boolean>;
  },
): Promise<T> => {
  const res = await baseRequest({
    url: getApiUrl(url),
    method: 'post',
    data: request,
    headers: opts?.headers || {},
  });
  return res.data?.data;
};
