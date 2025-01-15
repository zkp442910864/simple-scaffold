export * from './index.type';
import { FC } from 'react';
import type { ITestButtonProps } from './index.type';

/**
 * 测试测试222
 */
export const TestButton: FC<ITestButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <button {...props}>{children ?? '请传入children222'}</button>
  );
};