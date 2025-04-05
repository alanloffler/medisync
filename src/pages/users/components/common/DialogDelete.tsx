// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
// External imports
import type { Dispatch, SetStateAction } from 'react';
import { AxiosError } from 'axios';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { UserApiService } from '@users/services/user-api.service';
import { UtilsString } from '@core/services/utils/string.service';
// Interface
interface IProps {
  onDeleteSuccess: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  user: IUser;
}

interface IVars {
  userId: string;
}
// React component
export function DialogDelete({ onDeleteSuccess, open, setOpen, user }: IProps) {
  const queryClient = useQueryClient();
  const { i18n, t } = useTranslation();

  const { mutate: remove } = useMutation<IResponse<IUser>, AxiosError, IVars>({
    mutationKey: ['users', 'remove', user._id],
    mutationFn: ({ userId }) => UserApiService.remove(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', 'search-users-by'],
      });
      queryClient.invalidateQueries({
        queryKey: ['users', 'removed-users'],
      });
      onDeleteSuccess();
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dialog.deleteUser.title')}</DialogTitle>
          <DialogDescription>{t('dialog.deleteUser.description')}</DialogDescription>
        </DialogHeader>
        <section className='text-sm'>
          <Trans
            components={{
              span: <span className='font-semibold' />,
              i: <i className='font-semibold' />,
            }}
            i18nKey={'dialog.deleteUser.content'}
            values={{
              firstName: UtilsString.upperCase(user.firstName, 'each'),
              lastName: UtilsString.upperCase(user.lastName, 'each'),
              identityCard: i18n.format(user.dni, 'integer', i18n.resolvedLanguage),
            }}
          />
        </section>
        <DialogFooter>
          <Button size='sm' variant='remove' onClick={() => remove({ userId: user._id })}>
            {t('button.deleteUser')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
