// Imports
import { useCapitalize } from '@core/hooks/useCapitalize';
// Interface
interface IIconShortcut {
  setAreaSelected: React.Dispatch<React.SetStateAction<string>>
  icon: string;
  iconSize: number;
  itemSize: number;
  label: string;
}
// React component
export function IconShortcut({ setAreaSelected, icon, iconSize, itemSize, label }: IIconShortcut) {
  const capitalize = useCapitalize();

  function getSVG(icon: string): string {
    return new URL(`../../../../assets/icons/${icon}.svg`, import.meta.url).href;
  }

  return (
    <button
      className='flex flex-col items-center justify-center space-y-2 rounded-md border p-2 shadow-sm hover:scale-105 transition-transform hover:animate-in hover:border-slate-300'
      style={{ width: itemSize, height: itemSize }}
      onClick={() => setAreaSelected(label)}
    >
      <img src={getSVG(icon)} width={iconSize} height={iconSize} />
      <span className='text-xs font-medium'>{capitalize(label)}</span>
    </button>
  );
}
