// Icons: https://lucide.dev/
import { X } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Input } from '@core/components/ui/input';
import { ScrollArea } from '@core/components/ui/scroll-area';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingText } from '@core/components/common/LoadingText';
// External imports
import { ChangeEvent, memo, useCallback, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { ITableManager } from '@core/interfaces/table.interface';
import type { IUser } from '@users/interfaces/user.interface';
import type { IUserSearch } from '@users/interfaces/user-search.interface';
import { EUserSearch, ESortingKeys } from '@users/enums/user-search.enum';
import { UserApiService } from '@users/services/user-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { useDebounce } from '@core/hooks/useDebounce';
// Interface
interface IUsersComboData {
  count: number;
  data: IUser[];
  total: number;
}

interface IVars {
  search: IUserSearch;
  skipItems: number;
  tableManager: ITableManager;
}
// React component
export function UsersCombo({
  searchBy,
  searchResult,
  sortingKey,
  placeholder,
}: {
  searchBy: EUserSearch;
  searchResult: (user: IUser) => void;
  sortingKey: ESortingKeys;
  placeholder: string;
}) {
  const DEBOUNCE_TIME: number = 500;
  const [openCombobox, setOpenCombobox] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch: string = useDebounce<string>(search, DEBOUNCE_TIME);
  const { i18n, t } = useTranslation();

  function handleSearch(event: ChangeEvent<HTMLInputElement>): void {
    setSearch(event.target.value);
  }

  const handleSelectedUser = useCallback(
    (user: IUser): void => {
      searchResult(user);
      setOpenCombobox(false);
      setSearch('');
    },
    [searchResult],
  );

  function handleCloseCombobox(): void {
    setOpenCombobox(false);
    setSearch('');
  }

  const {
    data: users,
    error,
    mutate: searchUsersBy,
    isError,
    isPending,
    isSuccess,
  } = useMutation<IResponse<IUsersComboData>, Error, IVars>({
    mutationKey: ['searchUsersBy', debouncedSearch],
    mutationFn: async (vars) => await UserApiService.searchUsersBy(vars.search, vars.tableManager, vars.skipItems),
    retry: 1,
  });

  useEffect(() => {
    if (debouncedSearch !== '') {
      setOpenCombobox(true);
      searchUsersBy({
        search: { value: debouncedSearch, type: searchBy },
        tableManager: { pagination: { pageIndex: 0, pageSize: 1000000 }, sorting: [{ id: sortingKey, desc: false }] },
        skipItems: 0,
      });
    } else {
      setOpenCombobox(false);
    }
  }, [debouncedSearch, searchBy, searchUsersBy, sortingKey]);

  const UserItem = memo(({ user, onSelect }: { user: IUser; onSelect: (user: IUser) => void }) => (
    <button
      type='button'
      onClick={() => onSelect(user)}
      className='w-full space-x-2 rounded-sm px-1.5 py-0.5 text-left hover:bg-slate-100 hover:transition-all'
    >
      <span>{UtilsString.upperCase(`${user.firstName} ${user.lastName}`, 'each')}</span>
      <span className='italic text-slate-500'>{`${t('label.identityCard')} ${i18n.format(user.dni, 'number', i18n.resolvedLanguage)}`}</span>
    </button>
  ));

  return (
    <main className='flex flex-col'>
      <section className='flex flex-row items-center space-x-3'>
        <Input
          type={searchBy === EUserSearch.NAME ? 'text' : 'number'}
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
          <ScrollArea className='mt-1 max-h-40 w-full overflow-auto rounded-md border bg-popover p-2 shadow-md'>
            {isPending && <LoadingText text={t('search.searching.users')} suffix='...' className='text-left' />}
            {isError && <InfoCard type='error' text={error.message} className='justify-start' />}
            {isSuccess &&
              users.data.data.length > 0 &&
              users.data.data.map((user) => (
                <li key={user._id} className='list-none'>
                  <UserItem user={user} onSelect={handleSelectedUser} />
                </li>
              ))}
          </ScrollArea>
        </section>
      )}
    </main>
  );
}
