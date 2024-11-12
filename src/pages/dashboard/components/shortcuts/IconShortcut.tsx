// External imports
import { motion } from 'motion/react';
// Imports
import { useCapitalize } from '@core/hooks/useCapitalize';
import { cn } from '@lib/utils';
// Interface
interface IIconShortcut {
  setAreaSelected: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  icon: string;
  iconSize: number;
  itemHeight: number;
  itemWidth: number;
  label: string;
}
// React component
export function IconShortcut({ setAreaSelected, className, icon, iconSize, itemHeight, itemWidth, label }: IIconShortcut) {
  const capitalize = useCapitalize();

  const animation = {
    item: {
      initial: { scale: 1 },
      animate: {
        scale: 1.2,
        transition: {
          type: 'spring',
          stiffness: 800,
          damping: 20,
          duration: 0.2,
          delay: 0,
        },
      },
    },
    label: {
      initial: { y: 0 },
      animate: {
        y: 3,
        transition: {
          type: 'spring',
          stiffness: 800,
          damping: 20,
          duration: 0.2,
          delay: 0,
        },
      },
    },
  };

  function getSVG(icon: string): string {
    return new URL(`../../../../assets/icons/${icon}.svg`, import.meta.url).href;
  }

  return (
    <motion.button
      initial='initial'
      animate='initial'
      whileHover='animate'
      className={cn('flex select-none flex-col items-center justify-center space-y-2 rounded-md border p-2 shadow-sm', className)}
      style={{ width: itemWidth, height: itemHeight, minWidth: itemWidth, minHeight: itemHeight }}
      onClick={() => setAreaSelected(label)}
    >
      <motion.img
        src={getSVG(icon)}
        width={iconSize}
        height={iconSize}
        onDragStart={(e) => e.preventDefault()}
        draggable={false}
        variants={animation.item}
      />
      <motion.span variants={animation.label} className='text-xs font-bold text-primary'>
        {capitalize(label)}
      </motion.span>
    </motion.button>
  );
}
