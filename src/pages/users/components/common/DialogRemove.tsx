// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
// Components
import { AuthBadge } from '@core/auth/components/AuthBadge';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import type { Dispatch, SetStateAction } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { UserApiService } from '@users/services/user-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { useNotificationsStore } from '@core/stores/notifications.store';
// Interface
interface IProps {
  onRemoveSuccess: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userSelected?: IUser;
}
// React component
export function DialogRemove({ onRemoveSuccess, open, setOpen, userSelected }: IProps) {
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { i18n, t } = useTranslation();

  const {
    error: errorDeleting,
    mutate: deleteUser,
    isError: isErrorDeleting,
    isPending: isPendingDelete,
  } = useMutation<IResponse<IUser>, Error, { id: string }>({
    mutationKey: ['users', 'remove-user', userSelected?._id],
    mutationFn: async ({ id }) => await UserApiService.delete(id),
    onSuccess: (response) => {
      onRemoveSuccess();
      setOpen(false);
      addNotification({ message: response.message, type: 'success' });
    },
    onError: (error) => {
      addNotification({ message: error.message, type: 'error' });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl'>{t('dialog.deleteUser.title')}</DialogTitle>
          {isErrorDeleting ? (
            <DialogDescription></DialogDescription>
          ) : (
            <DialogDescription className='flex items-center justify-between'>
              <span>{t('dialog.deleteUser.description')}</span>
              <AuthBadge />
            </DialogDescription>
          )}
        </DialogHeader>
        <section className='flex flex-col'>
          {isErrorDeleting ? (
            <InfoCard text={errorDeleting.message} variant='error' />
          ) : (
            <div className='text-sm'>
              <Trans
                i18nKey='dialog.deleteUser.content'
                values={{
                  firstName: UtilsString.upperCase(userSelected?.firstName, 'each'),
                  lastName: UtilsString.upperCase(userSelected?.lastName, 'each'),
                  identityCard: i18n.format(userSelected?.dni, 'integer', i18n.resolvedLanguage),
                }}
                components={{
                  span: <span className='font-semibold' />,
                  i: <i />,
                }}
              />
            </div>
          )}
        </section>
        <DialogFooter className='flex justify-end'>
          {isErrorDeleting ? (
            <Button variant='default' size='sm' onClick={() => setOpen(false)}>
              {t('button.close')}
            </Button>
          ) : (
            <div className='flex space-x-4'>
              <Button variant='ghost' size='sm' onClick={() => setOpen(false)}>
                {t('button.cancel')}
              </Button>
              <Button variant='remove' size='sm' onClick={() => userSelected && deleteUser({ id: userSelected._id })}>
                {isPendingDelete ? <LoadingDB className='p-0' text={t('loading.deleting')} variant='button' /> : t('button.deleteUser')}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
