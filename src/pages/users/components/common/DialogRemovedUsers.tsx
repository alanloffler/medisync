// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
import { ScrollArea } from '@core/components/ui/scroll-area';
// External imports
import type { Dispatch, SetStateAction } from 'react';
import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { UserApiService } from '@users/services/user-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { format } from '@formkit/tempo';
import { Trash2 } from 'lucide-react';
// Interface
interface IProps {
  onRestoreSuccess: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
// React component
export function DialogRemovedUsers({ onRestoreSuccess, open, setOpen }: IProps) {
  const queryClient = useQueryClient();
  const { i18n, t } = useTranslation();

  const { data: users } = useQuery<IResponse<IUser[]>, AxiosError>({
    queryKey: ['users', 'removed-users'],
    queryFn: () => UserApiService.findRemovedUsers(),
  });

  const { mutate: restore } = useMutation<IResponse<IUser>, AxiosError, { userId: string }>({
    mutationKey: ['users', 'restore'],
    mutationFn: ({ userId }) => UserApiService.restore(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', 'removed-users'],
      });
      queryClient.invalidateQueries({
        queryKey: ['users', 'search-users-by'],
      });
      onRestoreSuccess();
      setOpen(false);
    },
  });

  const fakeData = [
    { firstName: 'User 01' },
    { firstName: 'User 02' },
    { firstName: 'User 03' },
    { firstName: 'User 04' },
    { firstName: 'User 05' },
    { firstName: 'User 06' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dialog.restoreUser.title')}</DialogTitle>
          <DialogDescription>{t('dialog.restoreUser.description')}</DialogDescription>
        </DialogHeader>
        <section className='space-y-3 text-sm'>
          {users?.data && (
            <ScrollArea className='h-full max-h-[205px] w-full'>
              <div className='flex flex-col space-y-1'>
                {users.data.map((user, index) => (
                  <div key={index} className='flex items-center justify-between bg-slate-50 px-3 py-2'>
                    <div>{UtilsString.upperCase(`${user.lastName}, ${user.firstName}`, 'all')}</div>
                    <div className='flex space-x-3'>
                      <div className='flex items-center space-x-1'>
                        <Trash2 size={12} strokeWidth={2} className='text-red-400' />
                        <span className='text-xxs text-muted-foreground'>{format(user.updatedAt, 'medium', i18n.resolvedLanguage)}</span>
                      </div>
                      <Button
                        className='bg-amber-200 text-xs font-normal text-amber-600 hover:bg-amber-300/70 hover:text-amber-700/70'
                        size='xs'
                        onClick={() => restore({ userId: user._id })}
                      >
                        {t('button.restore')}
                      </Button>
                    </div>
                  </div>
                ))}
                {fakeData.map((user, index) => (
                  <div key={index} className='flex justify-between bg-slate-50 p-2'>
                    <div key={index + 'z'}>{user.firstName}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </section>
        <DialogFooter className='pt-3'>
          <Button size='sm' variant='default' onClick={() => setOpen(false)}>
            {t('button.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
