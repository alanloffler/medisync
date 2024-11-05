// Imports
import { useCapitalize } from '@core/hooks/useCapitalize';
// Interface
interface IIconShortcut {
  setAreaSelected: React.Dispatch<React.SetStateAction<string>>;
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
      className='flex select-none flex-col items-center justify-center space-y-2 rounded-md border p-2 shadow-sm transition-transform hover:border-slate-300 [&>img]:hover:scale-125 [&>img]:hover:animate-in'
      style={{ width: itemSize, height: itemSize, minWidth: itemSize, minHeight: itemSize }}
      onClick={() => setAreaSelected(label)}
    >
      <img src={getSVG(icon)} width={iconSize} height={iconSize} />
      <span className='text-xs font-medium'>{capitalize(label)}</span>
    </button>
  );
}
