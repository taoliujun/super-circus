import loadjs from 'loadjs';
import { WechatConfigInterface } from 'taoliujun-shy-jobs-interface/lib/h5/user';

/** 加载wechat js */
const loadWechatJS = (): Promise<typeof window['wx']> => {
  loadjs('//res.wx.qq.com/open/js/jweixin-1.6.0.js', 'wechat');
  return new Promise((resolve) => {
    loadjs.ready('wechat', () => {
      resolve(window.wx);
    });
  });
};

/** wechat ready */
// eslint-disable-next-line import/no-unused-modules
export const wechatReady = (): Promise<typeof window['wx']> => {
  return new Promise((resolve) => {
    loadWechatJS().then((wx) => {
      wx.ready(() => {
        resolve(wx);
      });
    });
  });
};

/** 初始化jssdk，网址改变后必须要重新调用此方法 */
export const wechatConfig = async (
  jsApiList: string[],
  url: string,
): Promise<typeof window['wx']> => {
  const wx = await loadWechatJS();
  const res = await WechatConfigInterface({ jsApiList, url });
  wx.config(res);

  wx.error((err: any) => {
    console.error('==微信jssdk初始化失败==', err);
  });

  return new Promise((resolve) => {
    wx.ready(() => {
      console.info('==微信jssdk初始化成功==');
      resolve(wx);
    });
  });
};
