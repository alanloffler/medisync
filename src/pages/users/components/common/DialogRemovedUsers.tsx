// Icons: https://lucide.dev/icons/
import { Trash2, Undo } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
import { ScrollArea } from '@core/components/ui/scroll-area';
// Components
import { AuthBadge } from '@core/auth/components/AuthBadge';
import { InfoCard } from '@core/components/common/InfoCard';
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

  const {
    error: errorUsers,
    data: users,
    isError: isErrorUsers,
    isLoading: isLoadingUsers,
  } = useQuery<IResponse<IUser[]>, AxiosError<IResponse>>({
    queryKey: ['users', 'removed-users'],
    queryFn: () => UserApiService.findRemovedUsers(),
  });

  const { isPending: isPendingRestore, mutate: restore } = useMutation<IResponse<IUser>, AxiosError, { userId: string }>({
    mutationKey: ['users', 'restore'],
    mutationFn: ({ userId }) => UserApiService.restore(userId),
    onSuccess: (response) => {
      const userToNotify = restoredUser;

      queryClient.invalidateQueries({
        queryKey: ['users', 'search-users-by'],
        refetchType: 'all',
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: ['users', 'removed-users'],
        exact: true,
        refetchType: 'all',
      });

      userToNotify &&
        addNotification({
          message: `${response.message} (${UtilsString.upperCase(`${userToNotify.lastName}, ${userToNotify.firstName}`, 'each')})`,
          type: 'success',
        });

      onRestoreSuccess();
      setRestoredUser(undefined);
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dialog.restoreUser.title')}</DialogTitle>
          <DialogDescription className='flex items-center justify-between'>
            <span>{t('dialog.restoreUser.description')}</span>
            <AuthBadge />
          </DialogDescription>
        </DialogHeader>
        <section className='flex flex-col items-center'>
          {isErrorUsers && <InfoCard text={errorUsers.response?.data.message} variant='error' />}
          {isLoadingUsers && <LoadingDB text={t('loading.users')} variant='default' />}
          {isPendingRestore && <LoadingDB text={t('loading.restoring')} />}
          {users && users.data.length === 0 && <InfoCard text={users.message} variant='warning' />}
          {users && users.data.length > 0 && (
            <div className='w-full space-y-3 text-sm'>
              <ScrollArea className='h-full max-h-[205px] w-full'>
                <div className='flex flex-col space-y-1'>
                  {users.data.map((user, index) => (
                    <section key={index} className='flex items-center justify-between bg-slate-50 px-3.5 py-2'>
                      <section>
                        <div>{UtilsString.upperCase(`${user.lastName}, ${user.firstName}`, 'each')}</div>
                        <span className='text-xs text-muted-foreground'>{`${t('label.identityCard')} ${i18n.format(user.dni, 'integer', i18n.resolvedLanguage)}`}</span>
                      </section>
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
                    </section>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </section>
        <DialogFooter>
          <Button className='disabled:opacity-100' disabled={isPendingRestore} size='sm' variant='default' onClick={() => setOpen(false)}>
            {t('button.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
