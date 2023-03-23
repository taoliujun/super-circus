import { ErrorBlock } from 'antd-mobile';
import { camelCase, trim, upperFirst } from 'lodash';
import type { FunctionComponent, PropsWithChildren } from 'react';
import { lazy, Suspense } from 'react';
import { Routes, Route, HashRouter, BrowserRouter } from 'react-router-dom';
import { Center } from './components/Center';
import { Loading } from './components/Loading';
import { appConfig } from './appConfig';
import { pageConfig } from './pageConfig';
import { GlobalStore } from './components/GlobalStore';
import './global.module.less';

// auto components
const components = require.context('./pages/', true, /index\.tsx/, 'lazy');

const routes = components
  .keys()
  .filter((v) => {
    if (v.includes('/components/')) {
      return false;
    }
    return v;
  })
  .map((v) => {
    const path = v.substring(1, v.length - 'index.tsx'.length - 1);
    const pathSplits = v.split('/');
    const componentName = upperFirst(camelCase(pathSplits[pathSplits.length - 2]));

    const component = lazy(async () => {
      const res = await components(v);

      return {
        default: res[componentName],
      };
    });

    return {
      path,
      component,
    };
  });

routes.push({
  path: '/',
  component: lazy(async () => {
    const res = await import('./pages/index/index');
    return {
      default: res.Index,
    };
  }),
});

const LoadC: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return <GlobalStore>{children}</GlobalStore>;
};

export const App: FunctionComponent = () => {
  const RouteType = appConfig.routeType === 'browser' ? BrowserRouter : HashRouter;

  return (
    <Suspense fallback={<Loading />}>
      <RouteType basename={`/${trim(pageConfig.distPath, '/')}/`}>
        <LoadC>
          <Routes>
            {routes.map((v) => {
              return <Route key={v.path} path={v.path} element={<v.component />} />;
            })}
            {/* 404 */}
            <Route
              path="*"
              element={
                <Center>
                  <ErrorBlock status="empty" />
                </Center>
              }
            />
          </Routes>
        </LoadC>
      </RouteType>
    </Suspense>
  );
};
