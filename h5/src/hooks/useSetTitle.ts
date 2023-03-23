import { useTitle } from 'ahooks';
import { appConfig } from '../appConfig';

/** 设置标题 */
export const useSetTitle = (title: string | boolean) => {
  useTitle(title === false ? appConfig.title || '' : `${title} - ${appConfig.title}`);
};
