// Imports
import { useTruncateText } from '@core/hooks/useTruncateText';
// Interface
interface IProps {
  id: string;
}
// React component
export function Id({ id }: IProps) {
  const truncate = useTruncateText();

  return <div className='mx-auto w-fit rounded-md bg-slate-100 px-1.5 py-1 text-center text-xxs text-slate-400'>{truncate(id, -3)}</div>;
}
