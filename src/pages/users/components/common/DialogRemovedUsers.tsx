// Icons: https://lucide.dev/icons/
import { Trash2, Undo } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
import { ScrollArea } from '@core/components/ui/scroll-area';
// Components
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { useState, type Dispatch, type SetStateAction } from 'react';
import { AxiosError } from 'axios';
import { format } from '@formkit/tempo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { AuthBadge } from '@core/auth/components/AuthBadge';
import { UserApiService } from '@users/services/user-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { useNotificationsStore } from '@core/stores/notifications.store';
// Interface
interface IProps {
  onRestoreSuccess: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
// React component
export function DialogRemovedUsers({ onRestoreSuccess, open, setOpen }: IProps) {
  const [restoredUser, setRestoredUser] = useState<IUser | undefined>(undefined);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const queryClient = useQueryClient();
  const { i18n, t } = useTranslation();

  const { data: users, isLoading: isLoadingUsers } = useQuery<IResponse<IUser[]>, AxiosError>({
    queryKey: ['users', 'removed-users'],
    queryFn: () => UserApiService.findRemovedUsers(),
  });

  const { mutate: restore } = useMutation<IResponse<IUser>, AxiosError, { userId: string }>({
    mutationKey: ['users', 'restore'],
    mutationFn: ({ userId }) => UserApiService.restore(userId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['users', 'removed-users'],
      });
      queryClient.invalidateQueries({
        queryKey: ['users', 'search-users-by'],
      });
      onRestoreSuccess();
      setOpen(false);
      restoredUser &&
        addNotification({
          message: `${response.message} (${UtilsString.upperCase(`${restoredUser.lastName}, ${restoredUser.firstName}`, 'each')})`,
          type: 'success',
        });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dialog.restoreUser.title')}</DialogTitle>
          <DialogDescription className='flex items-center justify-between'>
            <div>{t('dialog.restoreUser.description')}</div>
            <AuthBadge />
          </DialogDescription>
        </DialogHeader>
        <section className='flex flex-col items-center'>
          {isLoadingUsers && <LoadingDB text={t('loading.users')} variant='default' />}
          {users?.data && (
            <div className='w-full space-y-3 text-sm'>
              <ScrollArea className='h-full max-h-[205px] w-full'>
                <div className='flex flex-col space-y-1'>
                  {users.data.map((user, index) => (
                    <div key={index} className='flex items-center justify-between bg-slate-50 px-3 py-2'>
                      <div>{UtilsString.upperCase(`${user.lastName}, ${user.firstName}`, 'each')}</div>
                      <div className='flex space-x-3'>
                        <div className='flex items-center space-x-1'>
                          <Trash2 size={13} strokeWidth={2} className='text-red-400' />
                          <span className='text-xxs text-muted-foreground'>{format(user.updatedAt, 'medium', i18n.resolvedLanguage)}</span>
                        </div>
                        <Button
                          className='gap-1 bg-amber-200 text-xs font-normal text-amber-600 hover:bg-amber-300/70 hover:text-amber-700/70'
                          size='xs'
                          onClick={() => {
                            restore({ userId: user._id });
                            setRestoredUser(user);
                          }}
                        >
                          <Undo size={13} strokeWidth={2} />
                          {t('button.restore')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </section>
        <DialogFooter>
          <Button size='sm' variant='default' onClick={() => setOpen(false)}>
            {t('button.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
