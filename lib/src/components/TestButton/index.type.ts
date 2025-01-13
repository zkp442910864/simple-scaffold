import { ReactNode } from 'react';

interface ITextButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  children?: ReactNode;
}

export type {
  ITextButtonProps
};
