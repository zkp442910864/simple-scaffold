import { FC } from 'react';
import { ITextButtonProps } from './index.type';

export const TestButton: FC<ITextButtonProps> = ({
  children,
}) => {
  return (
    <button>{children ?? '请传入children'}</button>
  );
};
