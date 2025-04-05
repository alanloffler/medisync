// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
// External imports
import { AxiosError } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { UserApiService } from '@users/services/user-api.service';
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
          <DialogTitle>Remove patient</DialogTitle>
          <DialogDescription>This is an irreversible action</DialogDescription>
        </DialogHeader>
        <section>
          <span>This is the dialog content with full user delete information.</span>
          {user && <p>User: {user.firstName}</p>}
        </section>
        <DialogFooter>
          <Button size='sm' variant='remove' onClick={() => remove({ userId: user._id })}>
            Eliminar usuario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
