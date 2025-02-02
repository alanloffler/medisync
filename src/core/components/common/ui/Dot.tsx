// External imports
import { useCallback, useEffect, useState } from 'react';
// Imports
import { cn } from '@lib/utils';
// Interfaces
interface IProps {
  color?: 'green' | 'red' | 'slate' | 'yellow';
  label?: string;
  size?: number;
}

interface IColor {
  color: string;
  dark: string;
  light: string;
}

interface ISize {
  max: string;
  min: string;
}
// Constants
const COLOR: IColor = { color: 'green', dark: 'bg-emerald-400', light: 'bg-emerald-200' };
const SIZE: ISize = { max: '14px', min: '9px' };
// React component
export function Dot({ color, label, size }: IProps) {
  const [dotSize, setDotSize] = useState<ISize>(SIZE);
  const [selectedColor, setSelectedColor] = useState<IColor>(COLOR);

  const findColor = useCallback((color: string): IColor => {
    const colors: IColor[] = [
      { color: 'green', dark: 'bg-emerald-400', light: 'bg-emerald-200' },
      { color: 'red', dark: 'bg-rose-400', light: 'bg-rose-200' },
      { color: 'slate', dark: 'bg-slate-400', light: 'bg-slate-200' },
      { color: 'yellow', dark: 'bg-amber-400', light: 'bg-amber-200' },
    ];

    return colors.find((item) => item.color === color) || colors[0];
  }, []);

  useEffect(() => {
    if (color) {
      const foundColor: IColor = findColor(color);
      if (foundColor) setSelectedColor(foundColor);
    }
  }, [color, findColor]);

  useEffect(() => {
    if (size) {
      setDotSize({
        max: `${size}px`,
        min: `${Math.round((((63 * size) / 100) * 2) / 2)}px`,
      });
    }
  }, [size]);

  return (
    <main className='flex items-center space-x-2'>
      <section
        className={cn(`flex items-center justify-center rounded-full`, selectedColor.light)}
        style={{ width: dotSize.max, height: dotSize.max }}
      >
        <span className={cn(`rounded-full`, selectedColor.dark)} style={{ width: dotSize.min, height: dotSize.min }}></span>
      </section>
      {label && <section>{label}</section>}
    </main>
  );
}
