import { ReactNode } from 'react';

export interface ITestButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  /** 内容 */
  children?: ReactNode;
}

