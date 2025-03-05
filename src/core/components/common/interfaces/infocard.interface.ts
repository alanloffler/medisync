export interface IInfoCard {
  className?: string;
  size?: 'default' | 'sm' | 'xsm' | 'xs';
  text?: string;
  type?: 'flat' | 'flat-colored';
  variant?: 'default' | 'error' | 'success' | 'warning';
}
