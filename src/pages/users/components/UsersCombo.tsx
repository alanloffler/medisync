// Icons: https://lucide.dev/
import { X } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Input } from '@/core/components/ui/input';
import { ScrollArea } from '@/core/components/ui/scroll-area';
// External imports
import { ChangeEvent, useEffect, useState } from 'react';
// Imports
import type { IUser } from '@/pages/users/interfaces/user.interface';
import { APPO_CONFIG } from '@/config/appointment.config';
import { UserApiService } from '@/pages/users/services/user-api.service';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useDebounce } from '@/core/hooks/useDebounce';
import { useDelimiter } from '@/core/hooks/useDelimiter';
// React component
export function UsersCombo({
  searchBy,
  searchResult,
  placeholder,
}: {
  searchBy: 'name' | 'dni';
  searchResult: (user: IUser) => void;
  placeholder: string;
}) {
  const [openCombobox, setOpenCombobox] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [showNoResults, setShowNoResults] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([] as IUser[]);
  const DEBOUNCE_TIME: number = 500;
  const capitalize = useCapitalize();
  const debouncedSearch = useDebounce<string>(search, DEBOUNCE_TIME);
  const delimiter = useDelimiter();

  function handleSearch(event: ChangeEvent<HTMLInputElement>): void {
    setSearch(event.target.value);
  }

  function handleSelectedUser(user: IUser): void {
    searchResult(user);
    setOpenCombobox(false);
    setSearch('');
  }

  function handleCloseCombobox(): void {
    setOpenCombobox(false);
    setSearch('');
  }

  useEffect(() => {
    if (debouncedSearch !== '') {
      setOpenCombobox(true);

      if (searchBy === 'name') {
        UserApiService.findAll(debouncedSearch, [{ id: 'lastName', desc: false }], 0, 10).then((response) => {
          if (response.statusCode === 200) {
            setShowNoResults(false);
            setUsers(response.data.data);
          }
          if (response.statusCode > 399) {
            setShowNoResults(true);
            setUsers([]);
          }
          // TODO: handle server error
        });
      }
      if (searchBy === 'dni') {
        UserApiService.findAllByDNI(debouncedSearch, [{ id: 'dni', desc: false }], 0, 10).then((response) => {
          if (response.statusCode === 200) {
            setShowNoResults(false);
            setUsers(response.data.data);
          }
          if (response.statusCode > 399) {
            setShowNoResults(true);
            setUsers([]);
          }
          // TODO: handle server error
        });
      }
    } else {
      setUsers([]);
      setOpenCombobox(false);
    }
  }, [debouncedSearch, searchBy]);

  return (
    <main className='flex flex-col'>
      <section className='flex flex-row items-center space-x-3'>
        <Input
          type={searchBy === 'name' ? 'text' : 'number'}
          value={search}
          onChange={handleSearch}
          placeholder={placeholder}
          className='h-9 w-full'
        />
        {openCombobox && (
          <button onClick={handleCloseCombobox} className='rounded-full bg-slate-200 p-2'>
            <X size={16} strokeWidth={2} />
          </button>
        )}
      </section>
      {openCombobox && (
        <section className='absolute mt-9 flex min-w-[50%] flex-row text-sm font-normal'>
          <ScrollArea className='mt-1 max-h-40 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md'>
            {users.length > 0 &&
              users.map((user) => (
                <li key={user._id} className='list-none'>
                  <button
                    type='button'
                    onClick={() => handleSelectedUser(user)}
                    className='w-full space-x-2 rounded-sm px-1.5 py-0.5 text-left hover:bg-slate-100 hover:transition-all'
                  >
                    <span>{`${capitalize(user.lastName)}, ${capitalize(user.firstName)}`}</span>
                    <span className='italic text-slate-500'>{`${APPO_CONFIG.dialog.userCombobox.dniLabel} ${delimiter(user.dni, '.', 3)}`}</span>
                  </button>
                </li>
              ))}
            {showNoResults && (
              <li className='list-none'>
                <span className='italic text-rose-500'>{APPO_CONFIG.dialog.userCombobox.noResults}</span>
              </li>
            )}
          </ScrollArea>
        </section>
      )}
    </main>
  );
}
