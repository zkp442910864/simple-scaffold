import { FC } from 'react';
import { ITestButtonProps } from './index.type';
export * from './index.type';

export const TestButton: FC<ITestButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <button {...props}>{children ?? '请传入children222'}</button>
  );
};