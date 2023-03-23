import pkgJson from '../package.json';
import { ENV } from './service/env';

/** 应用配置 */
export const appConfig = {
  title: '首信报名系统',
  /** 环境 */
  env: ENV,
  /** 路由方式 browser 或 hash */
  routeType: 'browser',
  /** 应用名称 */
  appName: pkgJson.name,
  /** 应用版本号 */
  appVersion: pkgJson.version,
};
