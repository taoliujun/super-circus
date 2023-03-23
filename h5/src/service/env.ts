export enum EnvEnum {
  DEV = 'dev',
  TEST = 'test',
  PROD = 'prod',
}

function getEnv(): EnvEnum {
  const port = Number(window.location.port);
  const hostName = window.location.hostname.toLowerCase();
  if (port > 80) {
    return EnvEnum.DEV;
  }
  if (hostName.startsWith('test')) {
    return EnvEnum.TEST;
  }
  return EnvEnum.PROD;
}

/** 环境 */
export const ENV = getEnv();

/** 本地开发环境 */
// eslint-disable-next-line import/no-unused-modules
export const isDev = ENV === EnvEnum.DEV;
/** 测试环境 */
// eslint-disable-next-line import/no-unused-modules
export const isTest = ENV === EnvEnum.TEST;
/** 生产环境 */
// eslint-disable-next-line import/no-unused-modules
export const isProd = ENV === EnvEnum.PROD;
