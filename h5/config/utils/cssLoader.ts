import path from 'path';
import MiniCssPlugin from 'mini-css-extract-plugin';
import type { RuleSetRule } from 'webpack';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const postcssConfig = require('../../.postcss');

/** css loader通用处理 */
export function getCssLoaders(
  file: 'css' | 'less',
  opt: {
    /** 是否是模块化css */
    isModule?: boolean;
    /** 是否开发环境 */
    isDev: boolean;
    /** 自适应大小的基准宽度 */
    autoSizeUnit?: number;
    /** 指定目录 */
    include?: RuleSetRule['include'];
  },
): RuleSetRule {
  const { isDev = false, isModule = false, autoSizeUnit = 0, include } = opt;

  const cssReg = /\.css$/i;
  const cssModuleReg = /\.module\.css$/i;
  const lessReg = /\.less$/i;
  const lessModuleReg = /\.module\.less$/i;

  // 是css文件
  const isCss = file === 'css';
  // 是less文件
  const isLess = file === 'less';

  // 匹配
  let test: RuleSetRule['test'] = cssReg;
  // 排除
  let exclude: RuleSetRule['exclude'] = cssModuleReg;
  // css importLoaders
  let importLoaders = 1;

  // loaders
  const loaders: RuleSetRule['use'] = [];

  // 设置test、exclude
  if (include && isCss) {
    test = /\.css$/i;
    exclude = [];
  } else if (include && isLess) {
    test = /\.less$/i;
    exclude = [];
  } else if (isCss) {
    if (isModule) {
      test = cssModuleReg;
      exclude = [];
    } else {
      test = cssReg;
      exclude = [cssModuleReg];
    }
  } else if (isLess) {
    if (isModule) {
      test = lessModuleReg;
      exclude = [];
    } else {
      test = lessReg;
      exclude = [lessModuleReg];
    }
  }

  if (isLess) {
    importLoaders += 1;
  }

  loaders.push(isDev ? 'style-loader' : MiniCssPlugin.loader);

  loaders.push({
    loader: 'css-loader',
    options: {
      importLoaders,
      modules: isModule
        ? {
            localIdentName: '[name]_[local]-[hash:8]',
          }
        : false,
    },
  });

  loaders.push({
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          ...postcssConfig.plugins,
          autoSizeUnit
            ? [
                'postcss-px-to-viewport',
                {
                  viewportWidth: autoSizeUnit,
                },
              ]
            : null,
        ],
      },
    },
  });

  if (isLess) {
    loaders.push('less-loader');
  }

  return {
    test,
    exclude,
    use: loaders,
    include: include || path.resolve(`src`),
  };
}
