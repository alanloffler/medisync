export interface IInfoCard {
  className?: string;
  iconSize?: number;
  size?: 'default' | 'sm' | 'xsm' | 'xs';
  text?: string;
  type?: 'flat';
  variant?: 'default' | 'error' | 'success' | 'warning';
}
