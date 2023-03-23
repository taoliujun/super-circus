import { useContext } from 'react';
import type { FunctionComponent } from 'react';
import { GlobalStoreContext } from '@/components/GlobalStore';

export const Help: FunctionComponent = () => {
  const { globalEnums } = useContext(GlobalStoreContext);

  return (
    <a href={globalEnums?.config?.helpUser || ''} target="_blank" rel="noreferrer">
      点击查看帮助文档
    </a>
  );
};
