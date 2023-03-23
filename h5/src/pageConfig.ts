import type { PageConfig } from '@/../config/pageConfig';
import { trim } from 'lodash';

const distPath = 'user';

/** 编译配置 */
export const pageConfig: PageConfig = {
  title: '首信报名系统',
  autoSizeUnit: 750,
  distPath,
  publicPath: '',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8082',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
      '/upload': {
        target: 'http://127.0.0.1:8082',
        changeOrigin: true,
      },
    },
    historyApiFallback: {
      index: `/${trim(distPath, '/')}/`,
    },
  },
};
