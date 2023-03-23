import '@/service/polyfill';
import { createRoot } from 'react-dom/client';
import { setRequestApi } from 'taoliujun-shy-jobs-interface/lib/request';
import { sentryReactInit } from '@/service/sentryReact';
import { loadConsoleScript } from '@/service/consoleScript';
import { App } from './app';
import { requestApi } from './service/request';

loadConsoleScript();
sentryReactInit();
setRequestApi(requestApi);

createRoot(document.querySelector('#root') as Element).render(<App />);
