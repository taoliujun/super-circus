import { appConfig } from '@/appConfig';
import Cookies from 'js-cookie';

/** 设置cookieToken */
const COOKIE_TOKEN_KEY = `${appConfig.appName}-${appConfig.env}-token`;

/** cookieToken变量缓存  */
let cookieTokenTmp = Cookies.get(COOKIE_TOKEN_KEY);

/** 获取cookieToken */
export const getCookieToken = () => {
  return cookieTokenTmp || Cookies.get(COOKIE_TOKEN_KEY);
};

/** 设置cookieToken */
export const setCookieToken = (val: string) => {
  cookieTokenTmp = val;
  try {
    Cookies.set(COOKIE_TOKEN_KEY, val);
  } catch (error) {
    //
  }
};

/** 删除cookieToken */
export const removeCookieToken = () => {
  Cookies.remove(COOKIE_TOKEN_KEY);
};
