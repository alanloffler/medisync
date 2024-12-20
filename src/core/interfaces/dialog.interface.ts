import { ReactNode } from 'react';

export interface IDialog {
  action: string;
  content: ReactNode;
  description: string;
  isOnly?: boolean;
  title: string;
}
