// Icons: https://lucide.dev/
import { Search } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Input } from '@/core/components/ui/input';
import { HEADER_CONFIG } from '../../config/layout/header.config';
// React component
export function HeaderSearch() {
  return (
    <form className='ml-auto flex-1 sm:flex-initial'>
      <div className='relative'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input type='search' placeholder={HEADER_CONFIG.search.placeholder} className='pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]' />
      </div>
    </form>
  );
}
