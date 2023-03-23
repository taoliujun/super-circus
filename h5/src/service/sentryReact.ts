import { appConfig } from '@/appConfig';
import * as SentryReact from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import type { SeverityLevel } from '@sentry/types';
import { ENV, EnvEnum } from './env';

export { SentryReact };

/** 初始化 */
export const sentryReactInit = () => {
  const dsn = 'https://c52adf1ebe8141baa85885637ad385e7@o1107172.ingest.sentry.io/6134077';

  SentryReact.init({
    enabled: [EnvEnum.PROD].includes(ENV),
    // enabled: true,
    debug: [EnvEnum.DEV].includes(ENV),
    release: `${appConfig.appName}-${ENV}-${appConfig.appVersion}`,
    dsn,
    environment: ENV,
    maxBreadcrumbs: 10,
    attachStacktrace: true,
    autoSessionTracking: false,
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: [window.location.origin],
      }),
    ],
    // transportOptions: {
    //     dsn,
    //     fetchParameters: {
    //         mode: 'no-cors',
    //     },
    // },
  });
};

/** React错误收集 */
export const captureReactException = (
  /** 错误信息 */
  err: Error,
  /** 错误类别 */
  category: string,
  /** 错误级别 */
  level: SeverityLevel,
) => {
  SentryReact.withScope((scope) => {
    if (err?.message) {
      scope.setFingerprint([err.message]);
    }

    const cate = category || 'default';

    scope.setTag('category', cate);
    scope.setLevel(level);

    console.log(`[SentryReact Send ${cate}]`, err);
    SentryReact.captureException(err);
  });
};
