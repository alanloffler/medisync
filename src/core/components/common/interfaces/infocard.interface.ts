export interface IInfoCard {
  text?: string;
  type: 'error' | 'success' | 'warning';
  className?: string;
}