import { ReactNode } from 'react';

export interface IDialog {
  action?: string;
  callback?: () => void;
  content: ReactNode;
  description?: string;
  isOnly?: boolean;
  title: string;
}
