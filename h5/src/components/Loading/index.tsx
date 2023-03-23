import { SpinLoading } from 'antd-mobile';
import type { ComponentProps, FunctionComponent } from 'react';
import { Center } from '../Center';

type Props = ComponentProps<typeof Center>;

/** loading */
export const Loading: FunctionComponent<Props> = ({ height }) => {
  return (
    <Center height={height}>
      <SpinLoading color="black" />
    </Center>
  );
};
