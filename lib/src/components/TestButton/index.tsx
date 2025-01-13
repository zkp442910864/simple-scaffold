import { FC } from 'react';
import { ITextButtonProps } from './index.type';

export const TestButton: FC<ITextButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <button {...props}>{children ?? '请传入children222'}</button>
  );
};