export interface IInfoCard {
  className?: string;
  iconSize?: number;
  size?: 'default';
  text?: string;
  type?: 'error' | 'success' | 'warning';
  variant?: 'default' | 'error' | 'success' | 'warning';
}
