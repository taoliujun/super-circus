import type { ContextType, FunctionComponent, PropsWithChildren } from 'react';
import { createContext } from 'react';
import type { InterfaceReply } from 'taoliujun-shy-jobs-interface/lib/request';
import { EnumsInterface } from 'taoliujun-shy-jobs-interface/lib/common/config';
import { useRequest } from 'ahooks';

export const GlobalStoreContext = createContext(
  {} as {
    globalEnums: InterfaceReply<typeof EnumsInterface>;
    dispatchGlobalEnums: () => void;
  },
);

type GlobalStoreType = ContextType<typeof GlobalStoreContext>;

export const GlobalStore: FunctionComponent<PropsWithChildren<unknown>> = ({ children }) => {
  const {
    data: globalEnums = {} as GlobalStoreType['globalEnums'],
    runAsync: dispatchGlobalEnums,
  } = useRequest(() => {
    return EnumsInterface({});
  });

  return (
    <GlobalStoreContext.Provider
      value={{
        globalEnums,
        dispatchGlobalEnums,
      }}
    >
      {children}
    </GlobalStoreContext.Provider>
  );
};
