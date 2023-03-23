import { Toast } from 'antd-mobile';

/** 提示 - 信息 */
export const toastInfo = (content: string) => {
  return new Promise<void>((resolve) => {
    Toast.show({
      content,
      afterClose: resolve,
    });
  });
};

/** 提示 - 成功 */
export const toastSuccess = (content: string) => {
  return new Promise<void>((resolve) => {
    Toast.show({
      icon: 'success',
      content,
      afterClose: resolve,
    });
  });
};

/** 提示 - 失败 */
export const toastFail = (content: string) => {
  return new Promise<void>((resolve) => {
    Toast.show({
      icon: 'fail',
      content,
      afterClose: resolve,
    });
  });
};

/** 提示 - 加载 */
export const toastLoading = (content: string) => {
  const { close } = Toast.show({
    icon: 'loading',
    content,
    duration: 0,
    maskClickable: false,
  });
  return close;
};

/** 提示 - 加载关闭 */
// eslint-disable-next-line import/no-unused-modules
export const toastHidden = () => {
  return Toast.clear();
};
