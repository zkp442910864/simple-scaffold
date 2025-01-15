import { ReactNode } from 'react';

interface ITestButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  /** 内容 */
  children?: ReactNode;
}

export type {
  ITestButtonProps
};