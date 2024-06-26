// Icons: https://lucide.dev/icons
import { Check, ChevronsUpDown } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/core/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/core/components/ui/popover';
// App
import { IUser } from '../interfaces/user.interface';
import { UserApiService } from '../services/user-api.service';
import { cn } from '@/lib/utils';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useEffect, useState } from 'react';
// React component
export function UsersCombobox(
  { 
    onSelectuser,
    notFoundText, 
    placeholder, 
    searchText 
  }: { 
    onSelectuser: (user: IUser) => void; 
    notFoundText: string;
    placeholder: string; 
    searchText: string 
  }
) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [openCombobox, setOpenCombobox] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const capitalize = useCapitalize();

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    UserApiService.findAll('', [{ id: 'lastName', desc: false }], page * 5, 5).then((response) => {
      if (response.statusCode === 200) {
        setUsers(response.data.data);
        setLoading(false);
      }
    });
  }, [page]);

  useEffect(() => {
    
    const observer = new IntersectionObserver(isVisible, { threshold: 1 });
    
    function isVisible(entries: IntersectionObserverEntry[]) {
        const entry = entries[0];
        console.log(entry)
          // if 90% of the section is visible
          if (entries[0].isIntersecting) {
          //   console.log('visible');
          //   // update the active state to the visible section
            setPage(prevPage => prevPage + 1);
          }    
          

      }
      // { threshold: 1 } // Fully in view

    if (loading) return; // Do not observe while loading new data

    const sentinel = document.getElementById('sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect(); // Clean up observer
  }, [loading]);

  return (
    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
      <PopoverTrigger asChild>
        <Button role='combobox' aria-expanded={openCombobox} className='w-full justify-between bg-white text-foreground shadow-sm hover:bg-white'>
          {value ? capitalize(value) : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0 h-[150px]'>
        <Command>
          <CommandInput placeholder={searchText} />
          <CommandList>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user._id}
                  value={`${[user.lastName, user.firstName].join(', ')}`}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpenCombobox(false);
                    onSelectuser(user);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === `${[user.lastName, user.firstName].join(', ')}` ? 'opacity-100' : 'opacity-0')} />
                  {`${capitalize(user.lastName)}, ${capitalize(user.firstName)}`}
                </CommandItem>
              ))}
              <div id="sentinel">sentinel</div>
            {loading && <p>Loading...</p>}
            </CommandGroup>
            
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
