import type { FunctionComponent } from 'react';
import { useSetTitle } from '@/hooks/useSetTitle';

export const Index: FunctionComponent = () => {
  useSetTitle('首页');

  return <div>i am index</div>;
};
