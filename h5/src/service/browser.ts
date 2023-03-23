import { toastInfo, toastLoading } from './toast';
import type { getRoute } from './webRoute';
import { getAbsoluteRoute } from './webRoute';

/** px to vw */
export const px2vw = (px: number): string => {
  return `${(px / 750) * 100}vw`;
};

type Route = Parameters<typeof getRoute>[0];

/** 新窗口打开 */
export const openWindow = (route: Route | string): void => {
  let url = route as string;
  if ((route as Route).name) {
    url = getAbsoluteRoute(route);
  }
  window.open(url, '_blank');
};

/** 关闭当前窗口 */
export const closeWindow = (): void => {
  window.close();
};

/** 是否是微信app */
export const isWechatApp = () => {
  return window.navigator.userAgent.toLowerCase().includes('micromessenger');
};

/** 图片压缩 */
export const imageCompression = async (input: File) => {
  try {
    const hide = toastLoading('压缩中');

    const pack = (
      await import(
        /* webpackChunkName: "npm.browser-image-compression" */
        'browser-image-compression'
      )
    ).default;

    const limitSize = 500;

    const compressFile = await pack(input, {
      maxSizeMB: limitSize / 1024,
      maxWidthOrHeight: 400,
      maxIteration: 100,
    });

    hide();

    if (compressFile.size > limitSize * 1024) {
      throw new Error(`文件超出${limitSize}KB大小`);
    }

    const url = await pack.getDataUrlFromFile(compressFile);

    return {
      url,
      file: compressFile,
    };
  } catch (err) {
    if ((err as Error)?.message?.includes('null is not an object')) {
      toastInfo('图片太大，请压缩后重试');
    } else {
      toastInfo((err as Error)?.message || '上传失败');
    }
    throw err;
  }
};
