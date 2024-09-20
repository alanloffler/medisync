// Icons: https://lucide.dev/
import { X } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Input } from '@/core/components/ui/input';
// App
import { ChangeEvent, useEffect, useState } from 'react';
import { IUser } from '@/pages/users/interfaces/user.interface';
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
  const [search, setSearch] = useState<string>('');
  const [users, setUsers] = useState<IUser[]>([] as IUser[]);
  const DEBOUNCE_TIME = 500;
  const capitalize = useCapitalize();
  const debouncedSearch = useDebounce<string>(search, DEBOUNCE_TIME);
  const delimiter: (input: string | number, delimiter: string, each: number) => string = useDelimiter();
  const [openCombobox, setOpenCombobox] = useState<boolean>(false);
  const [showNoResults, setShowNoResults] = useState<boolean>(false);

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
        });
      }
    } else {
      setUsers([]);
      setOpenCombobox(false);
    }
  }, [debouncedSearch, searchBy]);

  return (
    <div className='relative w-full'>
      <div className='flex w-full flex-row items-center space-x-3'>
        <Input type={searchBy === 'name' ? 'text' : 'number'} value={search} onChange={handleSearch} placeholder={placeholder} className='h-9' />
        {openCombobox && (
          <button onClick={handleCloseCombobox} className='rounded-full bg-slate-200 p-2'>
            <X className='h-4 w-4' strokeWidth={2} />
          </button>
        )}
      </div>
      {openCombobox && (
        <ul className='absolute z-50 w-72 mt-1 border overflow-y-auto h-40 rounded-md bg-popover p-3 text-popover-foreground shadow-md'>
          {users.length > 0 &&
            users.map((user) => (
              <li key={user._id} className='relative'>
                <button
                  type='button'
                  onClick={() => handleSelectedUser(user)}
                  className='w-full rounded-sm px-1.5 py-0.5 text-left text-sm font-normal hover:bg-slate-100 hover:transition-all space-x-2'
                >
                  <span>{`${capitalize(user.lastName)}, ${capitalize(user.firstName)}`}</span>
                  <span className='italic text-slate-500'>{`- DNI ${delimiter(user.dni, '.', 3)}`}</span>
                </button>
              </li>
            ))}
          {showNoResults && <>No results</>}
        </ul>
      )}
    </div>
  );
}
