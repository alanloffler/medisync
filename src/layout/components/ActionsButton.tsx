// Icons: https://lucide.dev/icons/
import { Plus } from 'lucide-react';
// External components
import { Select, SelectContent, SelectGroup, SelectTrigger } from '@/core/components/ui/select';
import { Separator } from '@/core/components/ui/separator';
// External imports
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Imports
import type { ILinks } from '@/layout/interfaces/links.interface';
import { useHeaderMenuStore } from '@/layout/stores/header-menu.service';
// React component
export function ActionsButton({ links }: { links: ILinks[] }) {
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const setMenuItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);

  function handleClick(link: ILinks): void {
    setOpen(false);
    navigate(link.path);
    setMenuItemSelected(link.menuId);
  }

  return (
    <Select open={open} onOpenChange={setOpen}>
      <section className='flex h-8 items-center rounded-md bg-primary/75 text-sm font-medium text-white'>
        <button onClick={() => navigate(links[0].path)} className='flex h-8 items-center space-x-1 rounded-l-md px-3 py-1'>
          <Plus strokeWidth={2} className='h-4 w-4' />
          <span>{links[0].title}</span>
        </button>
        <SelectTrigger className='h-8 w-fit rounded-l-none rounded-r-md bg-primary focus:ring-0'></SelectTrigger>
      </section>
      <SelectContent align='end' className='text-sm font-medium text-white [&>div]:p-0'>
        <SelectGroup>
          {links.map((link, index) => (
            <div key={link.id}>
              <button className='flex w-full items-center space-x-2 bg-primary/75 px-2 py-1 hover:bg-primary' onClick={() => handleClick(link)}>
                <Plus strokeWidth={2} className='h-4 w-4' />
                <span>{link.title}</span>
              </button>
              {index < links.length - 1 && <Separator className='bg-primary/50' />}
            </div>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
